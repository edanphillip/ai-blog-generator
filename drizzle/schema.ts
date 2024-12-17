import { pgTable, primaryKey, unique, varchar, integer, numeric, timestamp, boolean, serial } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const stripeTransaction = pgTable("stripe_transaction", {
  transactionId: varchar("transaction_id", { length: 15 }).notNull(),
  userId: integer("user_id").notNull(),
  amountPaid: numeric("amount_paid", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at", { mode: 'string' }).default(sql`now()`),
},
(table) => {
  return {
    stripeTransactionTransactionId: primaryKey({ columns: [table.transactionId], name: "stripe_transaction_transaction_id" }),
    transactionId: unique("transaction_id").on(table.transactionId),
  };
});

export const textFile = pgTable("text_file", {
  fileId: integer("file_id").notNull(),
  userId: integer("user_id").notNull(),
  fileKey: varchar("file_key", { length: 255 }).notNull(),
},
(table) => {
  return {
    textFileFileId: primaryKey({ columns: [table.fileId], name: "text_file_file_id" }),
  };
});

export const tokenTransaction = pgTable("token_transaction", {
  transactionId: serial("transaction_id").notNull(),
  userId: integer("user_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at", { mode: 'string' }).default(sql`now()`),
},
(table) => {
  return {
    tokenTransactionTransactionId: primaryKey({ columns: [table.transactionId], name: "token_transaction_transaction_id" }),
    transactionId: unique("transaction_id").on(table.transactionId),
  };
});

export const user = pgTable("user", {
  id: serial("id").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  clerkId: varchar("clerk_id", { length: 255 }),
  stripeId: varchar("stripe_id", { length: 255 }),
  deleted: boolean("deleted").default(false),
},
(table) => {
  return {
    userId: primaryKey({ columns: [table.id], name: "user_id" }),
    clerkId: unique("clerk_id").on(table.clerkId),
  };
});
