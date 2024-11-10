"use server"
import { pages } from "~/app/models";
import { pages as pagesSchema } from "./schema";
import { db } from ".";
import { eq } from "drizzle-orm";

export async function updatePage(newPage: pages) {
  await db
    .update(pagesSchema)
    .set({
      slug: newPage.slug,
      overrideName: newPage.overrideName,
      description: newPage.description,
      imageURL: newPage.imageURL,

      links: newPage.links,
      layout: newPage.layout,
      customisationOptions: newPage.customisationOptions,

      disable: newPage.disable,
    })
    .where(eq(pagesSchema.id, newPage.id));
}

export async function updatePageScreenshot(id: number,screenshot: string) {
  await db
    .update(pagesSchema)
    .set({
      screenshot: screenshot,
    })
    .where(eq(pagesSchema.id, id));
}