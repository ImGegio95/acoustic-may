import CheckoutForm from "./CheckoutForm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, shippingOptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function CheckoutPageWrapper() {
  const session = await auth();
  let dbUser = null;

  if (session?.user?.email) {
    const res = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    if (res.length > 0) {
      dbUser = res[0];
    }
  }

  const activeShippingOptions = await db.select().from(shippingOptions).where(eq(shippingOptions.isActive, true));

  return <CheckoutForm dbUser={dbUser} shippingOptions={activeShippingOptions} />;
}
