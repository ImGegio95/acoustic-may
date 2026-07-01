import {
  mysqlTable,
  varchar,
  text,
  decimal,
  timestamp,
  serial,
  bigint,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
});

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: bigint("category_id", { mode: "number", unsigned: true }).references(() => categories.id),
  image: varchar("image", { length: 255 }),
  images: text("images"), // JSON string for gallery
  badge: varchar("badge", { length: 50 }),
  technicalSpecs: text("technical_specs"), // JSON string
  type: varchar("type", { length: 20 }).default("simple"), // 'simple' or 'variable'
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const attributes = mysqlTable("attributes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  displayType: varchar("display_type", { length: 20 }).default("text"), // 'text' or 'color'
});

export const attrValues = mysqlTable("attr_values", {
  id: serial("id").primaryKey(),
  attributeId: bigint("attribute_id", { mode: "number", unsigned: true }).references(() => attributes.id),
  value: varchar("value", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  hexColor: varchar("hex_color", { length: 7 }), // e.g. #000000
});

export const productVariants = mysqlTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: bigint("product_id", { mode: "number", unsigned: true }).references(() => products.id),
  name: varchar("name", { length: 255 }),
  slug: varchar("slug", { length: 255 }).unique(),
  price: decimal("price", { precision: 10, scale: 2 }),
  description: text("description"),
  image: varchar("image", { length: 255 }),
  images: text("images"), // JSON string for variant gallery
  stock: bigint("stock", { mode: "number" }).default(0),
});

export const variantAttr = mysqlTable("variant_attr", {
  id: serial("id").primaryKey(),
  variantId: bigint("variant_id", { mode: "number", unsigned: true }).references(() => productVariants.id),
  attributeValueId: bigint("attribute_value_id", { mode: "number", unsigned: true }).references(() => attrValues.id),
});

export const settings = mysqlTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  attributes: many(variantAttr),
}));

export const variantAttrRelations = relations(variantAttr, ({ one }) => ({
  variant: one(productVariants, {
    fields: [variantAttr.variantId],
    references: [productVariants.id],
  }),
  attributeValue: one(attrValues, {
    fields: [variantAttr.attributeValueId],
    references: [attrValues.id],
  }),
}));

export const attrValuesRelations = relations(attrValues, ({ one }) => ({
  attribute: one(attributes, {
    fields: [attrValues.attributeId],
    references: [attributes.id],
  }),
}));

export const attributesRelations = relations(attributes, ({ many }) => ({
  values: many(attrValues),
}));
