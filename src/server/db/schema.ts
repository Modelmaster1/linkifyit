// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  varchar,
  json,
} from "drizzle-orm/pg-core";
import { link } from "fs";
import { LayoutStuff } from "~/app/edit/test/2/gridOptions";
import CustomiseOptions from "~/app/edit/test/_comps/customise";
import { CustomiseOptionsModel } from "~/app/models";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `linkifyit_${name}`);

export const linkComs = createTable(
  "link",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    description: varchar("description", { length: 500 }),
    ownerID: varchar("ownerId", { length: 256 }),

    iconURL: varchar("iconUrl", { length: 256 }),
    url: varchar("url", { length: 256 }).notNull(),

    isHidden: boolean("isHidden").default(false),

    createdAt: timestamp("createdAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);

export const pages = createTable(
  "views",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 256 }).notNull(),
    overrideName: varchar("overrideName", { length: 500 }),
    description: varchar("overrideDescription", { length: 500 }),
    ownerId: varchar("ownerId", { length: 256 }),

    imageURL: varchar("imageUrl"),

    links: integer("linkIDs").array().notNull(),
    layout: json("layout").$type<LayoutStuff | null>(),
    customisationOptions: json("customisationOptions").$type<CustomiseOptionsModel | null>(),
    screenshot: varchar("screenshot"),

    disable: boolean("disable").default(false),

    createdAt: timestamp("createdAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
    autoSortLinks: boolean("autosortlinks").default(true),
  },
  (example) => ({
    slugIndex: index("slug_idx").on(example.slug),
  })
);