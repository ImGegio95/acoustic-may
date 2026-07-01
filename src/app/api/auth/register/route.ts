import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, email, password, accountType, 
      taxCode, vatNumber, pec, sdi 
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Dati obbligatori mancanti." }, { status: 400 });
    }

    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: "Un account con questa email esiste già." }, { status: 400 });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert user
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      accountType: accountType || "private",
      taxCode: taxCode || null,
      vatNumber: vatNumber || null,
      pec: pec || null,
      sdi: sdi || null,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Errore durante la registrazione." }, { status: 500 });
  }
}
