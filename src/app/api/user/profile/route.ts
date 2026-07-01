import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Non autorizzato" }, { status: 401 });
    }

    const body = await req.json();
    const { name, taxCode, vatNumber, pec, sdi, billingAddress, shippingAddress } = body;

    await db.update(users)
      .set({
        name,
        taxCode: taxCode || null,
        vatNumber: vatNumber || null,
        pec: pec || null,
        sdi: sdi || null,
        billingAddress: billingAddress || null,
        shippingAddress: shippingAddress || null,
      })
      .where(eq(users.email, session.user.email));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Errore di salvataggio del profilo." }, { status: 500 });
  }
}
