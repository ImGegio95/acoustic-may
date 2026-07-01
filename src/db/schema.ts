import { mysqlTable, serial, varchar, decimal, text, bigint, timestamp } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: bigint("category_id", { mode: "number", unsigned: true }).references(() => categories.id),
  image: varchar("image", { length: 255 }),
  images: text("images"), // JSON string for gallery
  stock: bigint("stock", { mode: "number" }).default(0),
  badge: varchar("badge", { length: 50 }), // e.g., 'Novità', '-15%'
  technicalSpecs: text("technical_specs"), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
});

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));
