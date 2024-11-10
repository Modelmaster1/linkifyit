import { linkComs, pages } from "~/server/db/schema";
import { LayoutStuff } from "./edit/test/2/gridOptions";

export type pages = typeof pages.$inferSelect

export type links = typeof linkComs.$inferSelect;

export type InfoModel = {
    slug: string
    overrideName: string | null
    description: string | null
    imageURL: string | null
}


export type UserInfo = {
    fullName: string | null
    imageUrl: string | null
    username: string | null
}

export type CustomiseOptionsModel = {
    style: "grid" | "list"
    backgroundColor: string
    textColor: string
    font: string
    defaultBackgroundColorForLinks: string
    useAutoLinkTinting: boolean
}