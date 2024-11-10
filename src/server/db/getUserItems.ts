"use server";
import { eq } from "drizzle-orm";
import { db } from ".";
import { pages, linkComs } from "./schema";

export async function getPages(userID: string) {
  const items = await db
    .select()
    .from(pages)
    .where(eq(pages.ownerId, userID))
    .orderBy(pages.slug);

  return items;
}

export async function getLinks(userID: string) {
  const items = await db
    .select()
    .from(linkComs)
    .where(eq(linkComs.ownerID, userID))
    .orderBy(linkComs.name)

  return items;
}
