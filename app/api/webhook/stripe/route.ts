import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/app/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});

export async function POST(request: Request) {
  console.log("Stripe webhook received");
  const body = await request.text();
  const supabase = createClient();

  const sig = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_SECRET_WEBHOOK_KEY!);
    console.log('Event type:', event.type);
  } catch (err: any) {
    console.error('Error verifying webhook signature:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }


  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(supabase, event.data.object as Stripe.Checkout.Session);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(supabase, event.data.object as Stripe.PaymentIntent);
        break;
      case 'charge.succeeded':
        await handleChargeSucceeded(supabase, event.data.object as Stripe.Charge);
        break;
      case 'customer.subscription.created':
        await handleCustomerSubscriptionCreated(supabase, event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(supabase, event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}


async function handleCheckoutSessionCompleted(supabase: any, session: Stripe.Checkout.Session) {
  console.log('Checkout Session Completed:', session.id);

  if (session.mode === 'subscription') {
    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const userId = session.metadata?.user_id || subscription.metadata?.user_id;
    const productId = session.metadata?.product_id || subscription.items.data[0]?.price.product;

    if (!userId || !productId) {
      console.error('Missing required metadata:', { userId, productId });
      return;
    }

    const { error } = await supabase
      .from('subscriptions')
      .update({
        stripe_subscription_id: subscriptionId,
        status: subscription.status,
        start_date: new Date(subscription.current_period_start * 1000).toISOString(),
        end_date: new Date(subscription.current_period_end * 1000).toISOString(),
        product_id: productId,
      })
      .eq('user_id', userId);

    if (error) {
      // If update fails (no record exists), try insert
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          stripe_subscription_id: subscriptionId,
          status: subscription.status,
          start_date: new Date(subscription.current_period_start * 1000).toISOString(),
          end_date: new Date(subscription.current_period_end * 1000).toISOString(),
          product_id: productId,
        });

      if (insertError) {
        console.error('Error upserting subscription:', insertError);
        throw insertError;
      }
    }
  }
}

async function handlePaymentIntentSucceeded(supabase: any, paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment Intent Succeeded:', paymentIntent.id);

  // Update the payment record
  const { error: updateError } = await supabase
    .from('payments')
    .update({ status: paymentIntent.status })
    .eq('payment_intent_id', paymentIntent.id);

  if (updateError) throw updateError;

  // If this payment is for a subscription, update or create the subscription record
  if (paymentIntent.metadata.subscription_id && paymentIntent.metadata.user_id) {
    const userId = paymentIntent.metadata.user_id;
    const subscriptionId = paymentIntent.metadata.subscription_id;

    // First, try to find an existing subscription for the user
    const { data: existingSubscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw fetchError;
    }

    const subscriptionData = {
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      status: 'active',
      start_date: new Date().toISOString(),
      payment_intent_id: paymentIntent.id
    };

    let error;

    if (existingSubscription) {
      // Update existing subscription
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('user_id', userId);
      error = updateError;
    } else {
      // Create new subscription
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert(subscriptionData);
      error = insertError;
    }

    if (error) throw error;
  }
}

async function handleChargeSucceeded(supabase: any, charge: Stripe.Charge) {
  console.log('Charge Succeeded:', charge.id);
  // You might want to update the payment record with the charge information
  const { error } = await supabase
    .from('payments')
    .update({
      charge_id: charge.id,
      receipt_url: charge.receipt_url,
    })
    .eq('payment_intent_id', charge.payment_intent);

  if (error) throw error;
}

export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint is accessible' });
}

async function handleCustomerSubscriptionCreated(supabase: any, subscription: Stripe.Subscription) {
  console.log('Customer Subscription Created:', subscription);

  const userId = subscription.metadata.user_id;
  const productId = subscription.items.data[0]?.price.product; // Get product ID from subscription

  if (!userId) {
    console.error('User ID not found in subscription metadata');
    return;
  }

  // First check if subscription exists
  const { data: existingSubscription, error: fetchError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error fetching existing subscription:', fetchError);
    throw fetchError;
  }

  const subscriptionData = {
    user_id: userId,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    start_date: new Date(subscription.current_period_start * 1000).toISOString(),
    end_date: new Date(subscription.current_period_end * 1000).toISOString(),
    product_id: productId, // Include product_id in the data
  };

  if (existingSubscription) {
    // Update existing subscription
    const { error } = await supabase
      .from('subscriptions')
      .update(subscriptionData)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  } else {
    // Insert new subscription
    const { error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData);

    if (error) {
      console.error('Error inserting subscription:', error);
      throw error;
    }
  }
}

async function handleInvoicePaymentSucceeded(supabase: any, invoice: Stripe.Invoice) {
  console.log('Invoice Payment Succeeded:', invoice.id);

  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const userId = subscription.metadata.user_id;
    const productId = subscription.items.data[0]?.price.product;

    if (!userId || !productId) {
      console.error('Missing required metadata:', { userId, productId });
      return;
    }

    const { error } = await supabase
      .from('subscriptions')
      .update({
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        start_date: new Date(subscription.current_period_start * 1000).toISOString(),
        end_date: new Date(subscription.current_period_end * 1000).toISOString(),
        product_id: productId,
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }
}
