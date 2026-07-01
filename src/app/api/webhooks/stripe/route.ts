import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature found" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Gestiamo solo l'evento di pagamento andato a buon fine
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const orderId = session.metadata?.orderId;
      
      if (!orderId) {
        console.error("No orderId in metadata!");
        return NextResponse.json({ error: "Missing order metadata" }, { status: 400 });
      }

      // Estraiamo l'indirizzo di spedizione (se presente)
      const shippingDetails = (session as any).shipping_details?.address;
      const customerName = (session as any).customer_details?.name || (session as any).shipping_details?.name || "";
      
      let formattedAddress = "";
      if (shippingDetails) {
        const { line1, line2, city, postal_code, state, country } = shippingDetails;
        formattedAddress = `${line1 || ''} ${line2 || ''}, ${postal_code || ''} ${city || ''} (${state || ''}) ${country || ''}`.trim().replace(/\s+/g, ' ');
      }

      // Aggiorniamo l'ordine sul database: da "incompleto" a "aperto" e "pagato"
      await db.update(orders)
        .set({
          orderStatus: 'aperto',
          paymentStatus: 'pagato',
          shippingAddress: formattedAddress,
          customerName: customerName || undefined,
        })
        .where(eq(orders.id, Number(orderId)));
        
      console.log(`✅ Ordine ${orderId} pagato con successo! Indirizzo salvato: ${formattedAddress}`);
      
      // Qui potremmo anche chiamare la funzione sendTransactionalEmail("order_received")
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
