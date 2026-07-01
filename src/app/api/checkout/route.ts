import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { products, productVariants, orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customerEmail, customerName, customerPhone, notes } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Il carrello è vuoto" }, { status: 400 });
    }

    const lineItems: any[] = [];
    let subtotal = 0;
    
    // Preparazione dei dati per il DB
    const dbOrderItems = [];

    // Verifichiamo i prezzi REALI dal DB, mai fidarsi dei prezzi arrivati dal browser
    for (const item of items) {
      const parts = item.id.toString().split('-');
      const productId = Number(parts[0]);
      const expectedVariantId = parts[1] ? Number(parts[1]) : null;

      const dbProduct = await db.query.products.findFirst({
        where: eq(products.id, productId),
      });

      if (!dbProduct) {
        return NextResponse.json({ error: `Prodotto non trovato: ${productId}` }, { status: 404 });
      }

      let price = Number(dbProduct.price);
      let name = dbProduct.name;
      let variantName = null;

      if (expectedVariantId) {
        const dbVariant = await db.query.productVariants.findFirst({
          where: eq(productVariants.id, expectedVariantId),
        });
        if (dbVariant) {
          price = Number(dbVariant.price || dbProduct.price);
          variantName = dbVariant.name;
          name = `${dbProduct.name} - ${dbVariant.name}`;
        }
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;
      
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: name,
          },
          unit_amount: Math.round(price * 100), // In centesimi
        },
        quantity: item.quantity,
      });

      dbOrderItems.push({
        productId: dbProduct.id,
        variantId: expectedVariantId,
        productName: dbProduct.name,
        variantName: variantName,
        quantity: item.quantity,
        unitPrice: price.toFixed(2),
        totalPrice: itemTotal.toFixed(2),
      });
    }

    // Regola di spedizione: Gratis sopra i 100€, altrimenti 9,90€
    const shippingCost = subtotal > 100 ? 0 : 9.90;
    const finalTotal = subtotal + shippingCost;

    // 1. CREIAMO UN ORDINE IN BOZZA (incompleto) SUL DB
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    const [insertedOrder] = await db.insert(orders).values({
      orderNumber,
      customerName: customerName || 'Sconosciuto',
      customerEmail: customerEmail || 'no-email@example.com',
      customerPhone,
      subtotal: subtotal.toString(),
      shippingCost: shippingCost.toString(),
      total: finalTotal.toString(),
      orderStatus: 'incompleto', // Stato temporaneo
      paymentStatus: 'in_attesa',
      notes,
    });

    const orderId = insertedOrder.insertId;

    // 2. Inseriamo i prodotti dell'ordine
    for (const item of dbOrderItems) {
      await db.insert(orderItems).values({
        orderId: Number(orderId),
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      });
    }

    // 3. Creiamo la sessione di Stripe collegandola all'ID dell'ordine
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3022';
    
    const sessionConfig: any = {
      payment_method_types: ["card", "paypal"], // Stripe abiliterà Apple/Google Pay in automatico
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["IT"], // Aggiungi altri paesi se spedisci all'estero
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`, // Se annulla torna al carrello
      metadata: {
        orderId: orderId.toString(), // FONDAMENTALE: collega il pagamento all'ordine nel DB
      }
    };

    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    if (shippingCost > 0) {
      sessionConfig.shipping_options = [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(shippingCost * 100),
              currency: 'eur',
            },
            display_name: 'Spedizione Standard',
          },
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Aggiorniamo l'ordine con l'ID della sessione
    await db.update(orders)
      .set({ stripeSessionId: session.id })
      .where(eq(orders.id, Number(orderId)));

    // Restituiamo l'URL per reindirizzare il cliente alla pagina di Stripe
    return NextResponse.json({ url: session.url });
    
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
