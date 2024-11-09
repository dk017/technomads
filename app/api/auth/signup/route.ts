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

    if (user) {
      // Add trial period for new user
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 2); // 2 days from now

      const { error: trialError } = await supabase
        .from('trial_periods')
        .insert({
          user_id: user.id,
          trial_end: trialEnd.toISOString(),
        });

      if (trialError) {
        console.error('Error creating trial period:', trialError);
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
