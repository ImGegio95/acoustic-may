"use server";

import { db } from "@/db";
import { announcements } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addAnnouncement(data: FormData) {
  const text = data.get("text") as string;
  await db.insert(announcements).values({ text });
  revalidatePath("/admin/annunci");
  revalidatePath("/");
}

export async function updateAnnouncement(data: FormData) {
  const id = Number(data.get("id"));
  const text = data.get("text") as string;
  await db.update(announcements).set({ text }).where(eq(announcements.id, id));
  revalidatePath("/admin/annunci");
  revalidatePath("/");
}

export async function deleteAnnouncement(id: number) {
  await db.delete(announcements).where(eq(announcements.id, id));
  revalidatePath("/admin/annunci");
  revalidatePath("/");
}

export async function toggleAnnouncement(id: number, currentStatus: boolean) {
  await db.update(announcements).set({ isActive: !currentStatus }).where(eq(announcements.id, id));
  revalidatePath("/admin/annunci");
  revalidatePath("/");
}

export async function moveAnnouncement(id: number, direction: 'up' | 'down') {
  const options = await db.select().from(announcements).orderBy(asc(announcements.sortOrder));
  
  for (let i = 0; i < options.length; i++) {
    if (options[i].sortOrder !== i) {
      await db.update(announcements).set({ sortOrder: i }).where(eq(announcements.id, options[i].id));
      options[i].sortOrder = i;
    }
  }

  const currentIndex = options.findIndex((o) => o.id === id);
  if (currentIndex === -1) return;

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= options.length) return;

  const currentOpt = options[currentIndex];
  const targetOpt = options[targetIndex];

  await db.update(announcements).set({ sortOrder: targetOpt.sortOrder }).where(eq(announcements.id, currentOpt.id));
  await db.update(announcements).set({ sortOrder: currentOpt.sortOrder }).where(eq(announcements.id, targetOpt.id));

  revalidatePath("/admin/annunci");
  revalidatePath("/");
}
