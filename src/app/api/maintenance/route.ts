import { getMaintenanceSettings } from "@/lib/db-actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = await getMaintenanceSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ enabled: false, allowedIps: [] });
  }
}
