import { createClient } from '@/app/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const supabase = createClient();

  if (code) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code);

      if (authError) throw authError;

      if (user) {
        // Check if user already has an active subscription
        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (!existingSubscription) {
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 2);
          const now = new Date().toISOString();

          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: user.id,
              status: 'active',
              price_id: 'trial',
              quantity: 1,
              trial_start: now,
              trial_end: trialEnd.toISOString(),
              current_period_start: now,
              current_period_end: trialEnd.toISOString(),
              created_at: now,
              cancel_at_period_end: false
            });

          console.log('Subscription creation:', subscriptionError ? 'Failed' : 'Success');
          if (subscriptionError) console.error('Subscription creation error:', subscriptionError);
        }
      }
    } catch (error) {
      console.error('Auth callback error:', error);
    }
  }

  return NextResponse.redirect(new URL('/jobs', requestUrl.origin));
}