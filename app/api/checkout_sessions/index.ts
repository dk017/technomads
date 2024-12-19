import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/app/utils/supabase/client';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia", // Use the latest API version
});

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    // Get the user from the session
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // Set this in your .env file
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id // Make sure this is set
      },
      subscription_data: {
        metadata: {
          user_id: user.id // Also set it here for subscription
        }
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs`,
      client_reference_id: user.id,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}