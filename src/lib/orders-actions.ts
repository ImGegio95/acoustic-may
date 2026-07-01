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
  const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
  if (!order) return;

  const template = await db.query.emailTemplates.findFirst({ where: eq(emailTemplates.triggerEvent, triggerEvent) });
  if (!template) return;

  const header = await db.query.settings.findFirst({ where: eq(settings.key, "email_header") });
  const footer = await db.query.settings.findFirst({ where: eq(settings.key, "email_footer") });

  const headerHtml = header?.value || "";
  const footerHtml = footer?.value || "";

  // Parse template variables
  let html = template.bodyHtml;
  html = html.replace(/{{NOME_CLIENTE}}/g, order.customerName);
  html = html.replace(/{{NUMERO_ORDINE}}/g, order.orderNumber);
  html = html.replace(/{{TRACKING_URL}}/g, order.trackingUrl || 'N/A');
  html = html.replace(/{{TOTALE}}/g, `${order.total} €`);
  
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
