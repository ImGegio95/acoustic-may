"use server";

import nodemailer from "nodemailer";

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Compila tutti i campi obbligatori." };
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL, ADMIN_EMAIL } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    return { error: "Errore di configurazione del server email. Contatta l'amministratore (configura il file .env)." };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "465"),
    secure: parseInt(SMTP_PORT || "465") === 465, // true for 465, false for 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  const senderEmail = SMTP_FROM_EMAIL || SMTP_USER;

  try {
    await transporter.sendMail({
      // L'email deve partire dall'utente autenticato per non finire in spam
      from: `"${name} (Sito Web)" <${senderEmail}>`, 
      // Se clicchi "Rispondi", risponderà all'utente
      replyTo: email,
      // Destinatario: la mail admin, oppure se manca, la mail stessa dell'SMTP
      to: ADMIN_EMAIL || SMTP_USER,
      subject: `Nuova richiesta dal sito: ${subject}`,
      text: `Hai ricevuto un nuovo messaggio da ${name} (${email}).\n\nOggetto: ${subject}\n\nMessaggio:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #BD5B2C;">Nuova richiesta dal sito Acoustic May</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Oggetto:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { error: "Si è verificato un errore durante l'invio del messaggio. Riprova più tardi." };
  }
}
