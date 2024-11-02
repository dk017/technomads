import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const supabase = createClient();
  if (code) {

    try {
      const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code);

      if (authError) throw authError;

      if (user) {
        // Check if user already has a trial period
        const { data: existingTrial } = await supabase
          .from('trial_periods')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!existingTrial) {
          // Create trial period for new OAuth user
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 2);

          await supabase
            .from('trial_periods')
            .insert({
              user_id: user.id,
              trial_end: trialEnd.toISOString(),
              is_active: true
            });
        }
      }
    } catch (error) {
      console.error('Auth callback error:', error);
    }
  }

  // Redirect to the jobs page after successful signup
  return NextResponse.redirect(new URL('/jobs', requestUrl.origin));
}