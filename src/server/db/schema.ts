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
} from "drizzle-orm/pg-core";

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

    links: integer("linkIDs").array().notNull(),

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