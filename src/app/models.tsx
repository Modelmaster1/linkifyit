import { linkComs, pages } from "~/server/db/schema";

export type pages = typeof pages.$inferSelect;

export type links = typeof linkComs.$inferSelect;