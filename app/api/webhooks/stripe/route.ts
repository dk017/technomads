import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createWebhookClient } from '@/app/utils/supabase/webhook-client';
import { headers } from 'next/headers';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

if (!process.env.STRIPE_SECRET_WEBHOOK_KEY) {
  throw new Error('STRIPE_WEBHOOK_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function handleSubscriptionUpdate(supabase: any, subscription: Stripe.Subscription) {
  try {
    let userId = subscription.metadata?.user_id;

    if (!userId) {
      const customer = await stripe.customers.retrieve(subscription.customer as string);
      if (!('deleted' in customer) && customer.metadata?.user_id) {
        userId = customer.metadata.user_id;
      }
    }

    if (!userId) {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('stripe_customer_id', subscription.customer)
        .single();

      if (userData) {
        userId = userData.id;
      }
    }

    if (!userId) {
      console.error('Could not determine user_id for subscription:', subscription.id);
      return;
    }

    // Get existing subscriptions for this user
    const { data: existingSubscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .or(`status.eq.active,status.eq.trialing`)
      .eq('user_id', userId);

    const subscriptionData = {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      status: subscription.status,
      price_id: subscription.items.data[0]?.price.id,
      quantity: subscription.items.data[0]?.quantity || 1,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      previous_plan_id: null as string | null,
      upgraded_from_subscription_id: null as string | null
    };

    // Handle different subscription scenarios
    if (['active', 'trialing'].includes(subscription.status)) {
      if (existingSubscriptions?.length > 0) {
        const existingSub = existingSubscriptions[0];

        // Check if this is a plan change
        if (existingSub.price_id !== subscription.items.data[0]?.price.id) {
          console.log('Plan change detected:', {
            from: existingSub.price_id,
            to: subscription.items.data[0]?.price.id
          });

          // Store the previous plan information
          subscriptionData.previous_plan_id = existingSub.price_id;
          subscriptionData.upgraded_from_subscription_id = existingSub.stripe_subscription_id;

          // Mark existing subscription as upgraded
          await supabase
            .from('subscriptions')
            .update({
              status: 'upgraded',
              ended_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', existingSub.stripe_subscription_id);
        }

        // Mark any other active/trialing subscriptions as upgraded
        if (existingSubscriptions.length > 1) {
          const otherSubIds = existingSubscriptions
            .slice(1)
            .map((sub: { stripe_subscription_id: any; }) => sub.stripe_subscription_id);

          await supabase
            .from('subscriptions')
            .update({
              status: 'upgraded',
              ended_at: new Date().toISOString()
            })
            .in('stripe_subscription_id', otherSubIds);
        }
      }

      // Insert or update the new subscription
      const { error: upsertError } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'stripe_subscription_id',
          returning: true
        });

      if (upsertError) throw upsertError;

    } else if (subscription.status === 'canceled') {
      // Handle subscription cancellation
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          ended_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);

      if (updateError) throw updateError;

    } else if (subscription.status === 'incomplete') {
      // For incomplete status, just store it without affecting other subscriptions
      const { error: upsertError } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'stripe_subscription_id',
          returning: true
        });

      if (upsertError) throw upsertError;

    } else {
      // Handle other status updates (past_due, unpaid, etc.)
      const { error: upsertError } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'stripe_subscription_id',
          returning: true
        });

      if (upsertError) throw upsertError;
    }

    // Log the transition for debugging
    console.log('Subscription transition:', {
      userId,
      subscriptionId: subscription.id,
      status: subscription.status,
      previousPlanId: subscriptionData.previous_plan_id,
      upgradedFrom: subscriptionData.upgraded_from_subscription_id
    });

    return userId;
  } catch (error) {
    console.error('Error in handleSubscriptionUpdate:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const supabase = createWebhookClient();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK_KEY!
    );

    console.log('Event type:', event.type);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionUpdate(supabase, event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          await handleSubscriptionUpdate(supabase, subscription);
        }
        break;

      // Monitor these events but no action required
      case 'invoice.created':
      case 'invoice.finalized':
      case 'invoice.updated':
      case 'invoice.paid':
        console.log(`Handled event ${event.type} - no action required`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint is accessible' });
}