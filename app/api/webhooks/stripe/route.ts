import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createWebhookClient } from '@/app/utils/supabase/webhook-client';
import { headers } from 'next/headers';
export const runtime = 'edge';


if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

if (!process.env.STRIPE_SECRET_WEBHOOK_KEY) {
  throw new Error('STRIPE_WEBHOOK_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function isSubscription(obj: any): obj is Stripe.Subscription {
  return (obj as Stripe.Subscription).object === 'subscription';
}

async function handleSubscriptionUpdate(supabase: any, eventObject: Stripe.PaymentIntent | Stripe.Subscription) {
  if (isSubscription(eventObject)) {
    console.log('Handling subscription update for:', eventObject.id);

    const subscriptionData = {
      user_id: eventObject.metadata?.user_id,
      stripe_subscription_id: eventObject.id,
      stripe_customer_id: eventObject.customer as string,
      status: eventObject.status,
      price_id: eventObject.items.data[0]?.price.id,
      quantity: eventObject.items.data[0]?.quantity || 1,
      cancel_at_period_end: eventObject.cancel_at_period_end,
      current_period_start: new Date(eventObject.current_period_start * 1000).toISOString(),
      current_period_end: new Date(eventObject.current_period_end * 1000).toISOString(),
      trial_start: eventObject.trial_start ? new Date(eventObject.trial_start * 1000).toISOString() : null,
      trial_end: eventObject.trial_end ? new Date(eventObject.trial_end * 1000).toISOString() : null,
      previous_plan_id: null as string | null,
      upgraded_from_subscription_id: null as string | null
    };

    try {
      let userId = eventObject.metadata?.user_id;

      if (!userId) {
        const customer = await stripe.customers.retrieve(eventObject.customer as string);
        if (!('deleted' in customer) && customer.metadata?.user_id) {
          userId = customer.metadata.user_id;
        }
      }

      if (!userId) {
        const { data: userData, error: userError } = await supabase
          .from('customers')
          .select('user_id')
          .eq('stripe_customer_id', eventObject.customer as string)
          .maybeSingle();

        if (userError || !userData) {
          console.error('Could not determine user_id for subscription:', eventObject.id);
          return;
        }

        userId = userData.id;
      }

      // Verify user exists in customers table
      const { data: userExists, error: userExistsError } = await supabase
        .from('customers')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (userExistsError || !userExists) {
        console.error(`User with ID ${userId} does not exist in customers table`);
        return;
      }

      // Get existing subscriptions for this user
      const { data: existingSubscriptions, error: existingSubsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (existingSubsError) {
        console.error('Error fetching existing subscriptions:', existingSubsError);
        return;
      }

      console.log('Existing subscriptions data:', eventObject.items.data[0]?.price.id);

      if (existingSubscriptions) {
        // Update the existing subscription
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update(subscriptionData)
          .eq('stripe_subscription_id', eventObject.id);

        if (updateError) {
          console.error('Error updating existing subscription:', updateError);
          throw updateError;
        }
      } else {
        // Insert the new subscription if it doesn't exist
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert(subscriptionData);

        if (insertError) {
          console.error('Error inserting new subscription:', insertError);
          throw insertError;
        }
      }

      // Log the transition for debugging
      console.log('Subscription transition:', {
        userId,
        subscriptionId: eventObject.id,
        status: eventObject.status,
        previousPlanId: subscriptionData.previous_plan_id,
        upgradedFrom: subscriptionData.upgraded_from_subscription_id
      });

      return userId;
    } catch (error) {
      console.error('Error in handleSubscriptionUpdate:', error);
      throw error;
    }
  } else {
    console.error('Event object is not a subscription');
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  console.log('Handling invoice payment succeeded for:', invoice.id);

  if (!invoice.subscription) {
    console.error('No subscription associated with this invoice');
    return;
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);

    if (!subscription || subscription.status !== 'active') {
      console.error('Subscription not found or not active:', invoice.subscription);
      return;
    }

    // Check for existing active subscription
    const { data: existingSubscription, error: existingError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', subscription.metadata.user_id)
      .eq('status', 'active')
      .maybeSingle();

    if (existingError) {
      console.error('Error fetching existing subscription:', existingError);
      return;
    }

    let newEndDate: string;
    let startDate: string;

    if (existingSubscription) {
      console.log('Existing subscription details:', {
        id: existingSubscription.id,
        status: existingSubscription.status,
        trial_end: existingSubscription.trial_end,
        isTrialSubscription: existingSubscription.trial_end !== null
      });

      // Calculate dates
      const existingEndDate = new Date(existingSubscription.current_period_end);
      const now = new Date();
      const remainingTime = Math.max(0, existingEndDate.getTime() - now.getTime());
      const newSubscriptionEnd = new Date(subscription.current_period_end * 1000);
      newEndDate = new Date(newSubscriptionEnd.getTime() + remainingTime).toISOString();
      startDate = new Date(subscription.current_period_start * 1000).toISOString();
    } else {
      newEndDate = new Date(subscription.current_period_end * 1000).toISOString();
      startDate = new Date(subscription.current_period_start * 1000).toISOString();
    }

    // Create the subscription data
    const newSubscriptionData = {
      id: crypto.randomUUID(),
      user_id: subscription.metadata.user_id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      status: 'active',
      price_id: subscription.items.data[0]?.price.id,
      quantity: subscription.items.data[0]?.quantity || 1,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_start: startDate,
      current_period_end: newEndDate,
      trial_start: null,
      trial_end: null,
      previous_plan_id: existingSubscription?.price_id || null,
      upgraded_from_subscription_id: existingSubscription?.id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('New subscription data:', newSubscriptionData);

    // Call the procedure directly with the data
    const { data: transactionResult, error: transactionError } = await supabase.rpc(
      'handle_subscription_upgrade',
      {
        old_sub_id: existingSubscription?.id || null,
        new_sub_data: newSubscriptionData
      }
    );

    if (transactionError) {
      console.error('Error in subscription upgrade transaction:', transactionError);
      return;
    }

    console.log('Transaction result:', transactionResult);

    if (existingSubscription) {
      await handleSubscriptionUpgradeEffects(
        supabase,
        subscription.metadata.user_id,
        existingSubscription,
        subscription
      );
    }

    console.log('Subscription upgrade completed successfully');

  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
    throw error;
  }
}

async function handleSubscriptionUpgradeEffects(
  supabase: any,
  userId: string,
  oldSubscription: any,
  newSubscription: Stripe.Subscription
) {
  try {
    // Update user's access level if needed
    const { error: userUpdateError } = await supabase
      .from('customers')
      .update({
        subscription_tier: newSubscription.items.data[0]?.price.id,
      })
      .eq('user_id', userId);

    if (userUpdateError) {
      console.error('Error updating user subscription tier:', userUpdateError);
    }
  } catch (error) {
    console.error('Error handling subscription upgrade effects:', error);
  }
}

async function testHandleInvoicePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  console.log('Handling invoice payment succeeded for:', invoice.id);

  if (!invoice.subscription) {
    console.error('No subscription associated with this invoice');
    return;
  }

  try {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);

    if (!subscription) {
      console.error('Subscription not found:', invoice.subscription);
      return;
    }
    console.log('Stripe subscription status:', subscription.status);
    if (subscription.status !== 'active') {
      console.error('Subscription is not active:', subscription.id);
      return;
    }

    // Calculate the new end date for the subscription
    const newEndDate = new Date(subscription.current_period_end * 1000).toISOString();

    // Check for existing active subscription
    const { data: existingSubscription, error: existingError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', subscription.metadata.user_id)
      .eq('status', 'active')
      .maybeSingle();

    if (existingError) {
      console.error('Error fetching existing subscription:', existingError);
      return;
    }

    if (existingSubscription) {
      console.log('Existing subscription:', existingSubscription);
      // Update the existing active subscription to 'upgraded' or 'expired'
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ status: 'upgraded', current_period_end: newEndDate })
        .eq('id', existingSubscription.id);

      if (updateError) {
        console.error('Error updating existing subscription:', updateError);
        return;
      }
    }

    console.log('Subscription:', subscription);

    // Insert the new subscription record
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: subscription.metadata.user_id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        status: 'active',
        price_id: subscription.items.data[0]?.price.id,
        quantity: subscription.items.data[0]?.quantity || 1,
        cancel_at_period_end: subscription.cancel_at_period_end,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: newEndDate,
        trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        previous_plan_id: null,
        upgraded_from_subscription_id: existingSubscription ? existingSubscription.id : null
      });



    if (insertError) {
      console.error('Error inserting new subscription:', insertError);
      return;
    }

    console.log('Subscription updated successfully:', subscription.id);

  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const supabase = createWebhookClient();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      console.log('No signature');
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK_KEY!
    );

    console.log('Event type:', event.type);

    switch (event.type) {
      // case 'payment_intent.succeeded':
      //   const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
      //   console.log('Payment intent succeeded:', paymentIntentSucceeded);
      //   await handleSubscriptionUpdate(supabase, paymentIntentSucceeded);
      //   break;

      // case 'customer.subscription.created':
      // case 'customer.subscription.updated':
      // case 'customer.subscription.deleted':
      //   const subscription = event.data.object as Stripe.Subscription;
      //       await handleSubscriptionUpdate(supabase, subscription);
      //       break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        const userId = invoice.subscription_details?.metadata?.user_id;

        if (!userId) {
          throw new Error('No user_id found in subscription metadata');
        }
        await handleInvoicePaymentSucceeded(invoice, supabase);
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