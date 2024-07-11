import {NextResponse} from 'next/server';
import Stripe from 'stripe';
import {headers} from 'next/headers';
import {createClient} from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST() {
  const headerStore = headers();
  const supabase = createClient();
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
              name: 'Project Pilot Pro Ultra',
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${headerStore.get('origin')}/checkoutSuccess`,
      cancel_url: `${headerStore.get('origin')}/`,
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
