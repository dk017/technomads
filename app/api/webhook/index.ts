import { buffer } from 'micro';
import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});

const webhookSecret: string = process.env.STRIPE_SECRET_WEBHOOK_KEY!;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.log(`❌ Error message: ${errorMessage}`);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        // Here, you can fulfill the order, e.g., update your database
        console.log(`Payment succeeded for session ${session.id}`);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default cors(webhookHandler as any);