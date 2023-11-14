// import Cors from 'micro-cors';
import {headers} from 'next/headers';
import {NextResponse} from 'next/server';

const stripe = require('stripe')(process.env.STRIPE_PRIVATE);

// const cors = Cors({
//   allowMethods: ['POST', 'HEAD'],
// });

const secret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  try {
    console.log('req.body:', req);
    const body = await req.text();

    const signature = headers().get('stripe-signature');

    const event = stripe.webhooks.constructEvent(null, signature, secret);

    if (event.type === 'checkout.session.completed') {
      console.log('🚀 ~ filroute.ts:29 ~ POST ~ add to db here:');
    }

    return NextResponse.json({result: event, ok: true});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'something went wrong',
        ok: false,
      },
      {status: 500},
    );
  }
}
