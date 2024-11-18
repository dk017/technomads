import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-10-28.acacia",
});

export async function POST(request: Request) {
  try {
    // Get and validate auth header
    const authHeader = request.headers.get('authorization');
    console.log("Authorization header received");

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Initialize Supabase client
    console.log("Initializing Supabase client");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    // Get request body
    const { priceId } = await request.json();
    console.log("Price ID received:", priceId);

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get user data
    console.log("Getting user data");
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("User fetch error:", userError);
      return NextResponse.json(
        { error: 'Authentication failed', details: userError.message },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log("User found:", user.email);

    // Get or create Stripe customer
    console.log("Checking for existing customer");
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (customerError && customerError.code !== 'PGRST116') {
      console.error("Customer fetch error:", customerError);
      return NextResponse.json(
        { error: 'Failed to fetch customer data', details: customerError.message },
        { status: 500 }
      );
    }

    let customerId: string;

    try {
      if (!customerData?.stripe_customer_id) {
        console.log("Creating new Stripe customer");
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            user_id: user.id
          }
        });
        customerId = customer.id;

        // Store customer in database
        const { error: insertError } = await supabase
          .from('customers')
          .insert({
            user_id: user.id,
            stripe_customer_id: customerId,
            email: user.email
          });

        if (insertError) {
          console.error("Customer insert error:", insertError);
          throw new Error('Failed to store customer data');
        }
      } else {
        customerId = customerData.stripe_customer_id;
        console.log("Using existing customer:", customerId);
      }

      // Create checkout session
      console.log("Creating Stripe checkout session");
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs`,
        metadata: {
          user_id: user.id
        },
        subscription_data: {
          metadata: {
            user_id: user.id
          }
        }
      });

      console.log("Checkout session created:", session.id);

      // Store session in database
      const { error: sessionError } = await supabase
        .from('checkout_sessions')
        .insert({
          session_id: session.id,
          user_id: user.id,
          price_id: priceId,
          status: session.status,
          created_at: new Date().toISOString(),
        });

      if (sessionError) {
        console.error("Session storage error:", sessionError);
        // Continue anyway as the checkout session is created
      }

      return NextResponse.json({
        sessionId: session.id,
        url: session.url
      });

    } catch (stripeError: any) {
      console.error("Stripe error:", stripeError);
      return NextResponse.json(
        {
          error: 'Stripe operation failed',
          details: stripeError.message
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("General error:", error);
    return NextResponse.json(
      {
        error: 'Checkout session creation failed',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
