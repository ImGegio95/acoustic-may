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

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }),
  shippingAddress: text("shipping_address"),
  billingAddress: text("billing_address"),
  
  paymentStatus: varchar("payment_status", { length: 50 }).default("aperto"),
  shippingStatus: varchar("shipping_status", { length: 50 }).default("aperto"),
  orderStatus: varchar("order_status", { length: 50 }).default("aperto"),
  
  trackingUrl: varchar("tracking_url", { length: 255 }),
  
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).notNull().default('0.00'),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const orderItems = mysqlTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: bigint("order_id", { mode: "number", unsigned: true }).references(() => orders.id),
  productId: bigint("product_id", { mode: "number", unsigned: true }).references(() => products.id),
  variantId: bigint("variant_id", { mode: "number", unsigned: true }).references(() => productVariants.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  variantName: varchar("variant_name", { length: 255 }),
  quantity: bigint("quantity", { mode: "number" }).notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

export const emailTemplates = mysqlTable("email_templates", {
  id: serial("id").primaryKey(),
  triggerEvent: varchar("trigger_event", { length: 100 }).notNull().unique(),
  subject: varchar("subject", { length: 255 }).notNull(),
  bodyHtml: text("body_html").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));
