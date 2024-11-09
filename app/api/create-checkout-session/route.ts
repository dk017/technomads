import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/app/utils/supabase/server';
import { cookies } from 'next/headers';
export const runtime = 'edge'; // Add this line


export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    const { priceId } = await req.json(); // Get priceId from request body

    if (error || !user) {
      console.log("No authenticated user found:", error?.message);
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    console.log("Authenticated user:", user.id);

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs`,
      metadata: {
        user_id: user.id,
        product_id: priceId,
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
