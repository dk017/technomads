import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
export const runtime = 'edge'; // Add this line


export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const cookieStore = cookies();
  const supabase = createClient();

  try {
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      let errorMessage = "An unexpected error occurred. Please try again later.";
      let statusCode = 400;

      if (signUpError.status === 409) {
        errorMessage = "An account with this email already exists.";
        statusCode = 409;
      } else if (signUpError.message) {
        errorMessage = signUpError.message;
      }

      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
    console.log('User:', user);
    if (user) {
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 2);
      const now = new Date().toISOString();

      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          status: 'active',
          trial_start: now,
          trial_end: trialEnd.toISOString(),
          current_period_start: now,
          current_period_end: trialEnd.toISOString(),
          price_id: 'trial',
          quantity: 1,
          created_at: now,
          cancel_at_period_end: false
        });

      if (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError);
      }
    }

    return NextResponse.redirect(`${requestUrl.origin}/login`, {
      status: 301,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
