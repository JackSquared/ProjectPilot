import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import {cookies} from 'next/headers';
import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs';
import {Database} from '@/lib/supabase.types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {});

export async function POST() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  await supabase.auth.getSession();
  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      submit_type: 'pay',
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Itinerary',
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.URL}/checkoutSuccess`,
      cancel_url: `${process.env.URL}/`,
    };

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params);

    return NextResponse.json({result: checkoutSession, ok: true});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {message: 'something went wrong', ok: false},
      {status: 500},
    );
  }
}
