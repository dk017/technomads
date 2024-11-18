import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@/app/utils/supabase/server';
export const runtime = 'edge'; // Add this line

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted'
]);


async function manageSubscriptionStatusChange(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  const supabase = createClient();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-10-28.acacia',
  });

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  });

  // Simplified subscription data to match your schema
  const subscriptionData = {
    user_id: subscription.metadata.user_id, // Make sure to include user_id in metadata when creating subscription
    product_id: subscription.items.data[0].price.product,
    status: subscription.status,
    start_date: new Date(subscription.current_period_start * 1000).toISOString(),
    end_date: new Date(subscription.current_period_end * 1000).toISOString(),
    stripe_subscription_id: subscription.id,
    updated_at: new Date().toISOString()
  };

  if (createAction) {
    const { error } = await supabase
      .from('subscriptions')
      .insert({
        ...subscriptionData,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('subscriptions')
      .update(subscriptionData)
      .eq('stripe_subscription_id', subscription.id);

    if (error) throw error;
  }
}


export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get('Stripe-Signature') as string;
  const webhookSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY;
  let event: Stripe.Event;
  console.log("Received webhook event:", body);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-10-28.acacia',
  });

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':{
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Processing checkout session:', session.id);
        const supabase = createClient();

        // Retrieve subscription
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        // Insert into subscriptions table
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: session.metadata?.user_id,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: session.customer as string,
            status: subscription.status,
            price_id: subscription.items.data[0].price.id,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          });

        if (insertError) {
          console.error('Error inserting subscription:', insertError);
          throw insertError;
        }

        console.log('Subscription saved successfully');
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await manageSubscriptionStatusChange(
          subscription.id,
          subscription.customer as string,
          event.type === 'customer.subscription.created'
        );
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const supabaseClient = createClient();
        await supabaseClient
          .from('payments')
          .insert({
            payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            user_id: paymentIntent.metadata.user_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Webhook handler failed. View logs.' },
      { status: 400 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}