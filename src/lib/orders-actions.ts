"use server";

import { db } from "@/db";
import { orders, orderItems, emailTemplates, settings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

export async function getOrders() {
  return await db.query.orders.findMany({
    with: {
      items: true,
    },
    orderBy: [desc(orders.createdAt)],
  });
}

export async function getOrderById(id: number) {
  return await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: {
        with: {
          product: true,
          variant: true,
        }
      },
    }
  });
}

export async function updateOrderStatus(id: number, type: 'payment' | 'shipping' | 'order', status: string, trackingUrl?: string) {
  const updateData: any = {};
  
  if (type === 'payment') updateData.paymentStatus = status;
  if (type === 'shipping') updateData.shippingStatus = status;
  if (type === 'order') updateData.orderStatus = status;
  if (trackingUrl !== undefined) updateData.trackingUrl = trackingUrl;

  await db.update(orders).set(updateData).where(eq(orders.id, id));
  
  if (type === 'shipping' && status === 'spedito') {
    await sendTransactionalEmail(id, 'order_shipped');
  }
  
  if (type === 'payment') {
    if (status === 'pagato') await sendTransactionalEmail(id, 'order_confirmed');
    if (status === 'annullato') await sendTransactionalEmail(id, 'payment_cancelled');
    if (status === 'rimborsato') await sendTransactionalEmail(id, 'payment_refunded');
  }

  revalidatePath("/admin/ordini");
}

export async function getEmailTemplates() {
  return await db.query.emailTemplates.findMany();
}

export async function updateEmailTemplate(triggerEvent: string, subject: string, bodyHtml: string) {
  const existing = await db.query.emailTemplates.findFirst({
    where: eq(emailTemplates.triggerEvent, triggerEvent)
  });

  if (existing) {
    await db.update(emailTemplates).set({ subject, bodyHtml }).where(eq(emailTemplates.triggerEvent, triggerEvent));
  } else {
    await db.insert(emailTemplates).values({ triggerEvent, subject, bodyHtml });
  }
  revalidatePath("/admin/email");
}

export async function sendTransactionalEmail(orderId: number, triggerEvent: string) {
  const order = await db.query.orders.findFirst({ 
    where: eq(orders.id, orderId),
    with: {
      items: {
        with: { product: true }
      }
    }
  });
  if (!order) return;

  const template = await db.query.emailTemplates.findFirst({ where: eq(emailTemplates.triggerEvent, triggerEvent) });
  if (!template) return;

  const header = await db.query.settings.findFirst({ where: eq(settings.key, "email_header") });
  const footer = await db.query.settings.findFirst({ where: eq(settings.key, "email_footer") });

  const headerHtml = header?.value || "";
  const footerHtml = footer?.value || "";

  // Generazione Tabella Prodotti e Scorporo IVA
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.acousticmay.it";
  let itemsHtml = `<table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-family: sans-serif;">
    <thead>
      <tr style="border-bottom: 2px solid #eaeaea; text-align: left;">
        <th style="padding: 12px; color: #7a7468; font-size: 14px;">Prodotto</th>
        <th style="padding: 12px; color: #7a7468; font-size: 14px; text-align: center;">Q.tà</th>
        <th style="padding: 12px; color: #7a7468; font-size: 14px; text-align: right;">Prezzo</th>
      </tr>
    </thead>
    <tbody>`;

  for (const item of order.items) {
    const imgUrl = item.product?.image ? (item.product.image.startsWith('http') ? item.product.image : `${baseUrl}${item.product.image}`) : `${baseUrl}/placeholder.png`;
    itemsHtml += `
      <tr style="border-bottom: 1px solid #eaeaea;">
        <td style="padding: 16px 12px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <img src="${imgUrl}" alt="${item.productName}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #eaeaea;" />
            <div>
              <strong style="display: block; color: #121212; font-size: 15px;">${item.productName}</strong>
              ${item.variantName ? `<span style="color: #7a7468; font-size: 13px;">${item.variantName}</span>` : ''}
            </div>
          </div>
        </td>
        <td style="padding: 16px 12px; text-align: center; color: #121212; font-weight: 500;">${item.quantity}</td>
        <td style="padding: 16px 12px; text-align: right; color: #121212; font-weight: 500;">${item.totalPrice} €</td>
      </tr>`;
  }

  const subtotalNum = parseFloat(order.total) - parseFloat(order.shippingCost || "0");
  const shippingNum = parseFloat(order.shippingCost || "0");
  const totalNum = parseFloat(order.total);
  // Scorporo IVA: Base Imponibile = Totale / 1.22, IVA = Totale - Base
  const taxableAmount = totalNum / 1.22;
  const vatAmount = totalNum - taxableAmount;

  itemsHtml += `
    </tbody>
    <tfoot>
      <tr>
        <td colspan="2" style="padding: 16px 12px 8px; text-align: right; color: #7a7468;">Subtotale</td>
        <td style="padding: 16px 12px 8px; text-align: right; font-weight: 500;">${subtotalNum.toFixed(2)} €</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 8px 12px; text-align: right; color: #7a7468;">Spedizione</td>
        <td style="padding: 8px 12px; text-align: right; font-weight: 500;">${shippingNum > 0 ? shippingNum.toFixed(2) + ' €' : 'Gratis'}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 8px 12px; text-align: right; color: #7a7468;">di cui IVA (22%)</td>
        <td style="padding: 8px 12px; text-align: right; font-weight: 500;">${vatAmount.toFixed(2)} €</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 16px 12px; text-align: right; color: #121212; font-weight: 700; font-size: 18px;">Totale</td>
        <td style="padding: 16px 12px; text-align: right; color: #121212; font-weight: 700; font-size: 18px;">${totalNum.toFixed(2)} €</td>
      </tr>
    </tfoot>
  </table>`;

  // Parse template variables
  let html = template.bodyHtml;
  html = html.replace(/{{NOME_CLIENTE}}/g, order.customerName);
  html = html.replace(/{{NUMERO_ORDINE}}/g, order.orderNumber);
  html = html.replace(/{{TRACKING_URL}}/g, order.trackingUrl || 'N/A');
  html = html.replace(/{{TOTALE}}/g, `${order.total} €`);
  html = html.replace(/{{TABELLA_PRODOTTI}}/g, itemsHtml);
  
  const finalHtml = `${headerHtml}\n${html}\n${footerHtml}`;
  
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "info@acousticmay.it";

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Acoustic May" <${fromEmail}>`,
      to: order.customerEmail,
      subject: template.subject.replace(/{{NUMERO_ORDINE}}/g, order.orderNumber),
      html: finalHtml,
    });
  } catch (error) {
    console.error("Failed to send transactional email:", error);
  }
}

// TEMP: Function to create a mock order for testing purposes
export async function createMockOrder() {
  const res = await db.insert(orders).values({
    orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    customerEmail: "test@example.com",
    customerName: "Mario Rossi",
    customerPhone: "3331234567",
    shippingAddress: "Via Roma 1, Milano",
    subtotal: "259.00",
    shippingCost: "0.00",
    total: "259.00"
  });
  
  const orderId = res[0].insertId;
  await db.insert(orderItems).values({
    orderId,
    productId: 1, // assumes product 1 exists
    productName: "Bontone 6c",
    variantName: "Nero",
    quantity: 1,
    unitPrice: "259.00",
    totalPrice: "259.00"
  });

  revalidatePath("/admin/ordini");
}
