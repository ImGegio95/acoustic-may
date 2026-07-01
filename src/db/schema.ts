import {
  mysqlTable,
  varchar,
  text,
  decimal,
  timestamp,
  int,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const categories = mysqlTable("categories", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
});

export const products = mysqlTable("products", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: int("category_id").references(() => categories.id),
  image: varchar("image", { length: 255 }),
  images: text("images"), // JSON string for gallery
  badge: varchar("badge", { length: 50 }),
  technicalSpecs: text("technical_specs"), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const settings = mysqlTable("settings", {
  id: int("id").primaryKey().autoincrement(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));
