import { NextResponse } from "next/server";
import { db } from "@/db";
import { shippingOptions } from "@/db/schema";
import { isNotNull, eq } from "drizzle-orm";

export async function GET() {
  const options = await db.select().from(shippingOptions).where(isNotNull(shippingOptions.minOrderValue));
  const activeOptions = options.filter(o => o.isActive === true);
  
  if (activeOptions.length > 0) {
    const minThreshold = Math.min(...activeOptions.map(o => Number(o.minOrderValue)));
    return NextResponse.json({ threshold: minThreshold });
  }
  return NextResponse.json({ threshold: null });
}
