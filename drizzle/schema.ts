import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, unique, varchar, int, decimal, timestamp, tinyint } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const stripeTransaction = mysqlTable("StripeTransaction", {
	transactionId: varchar("transaction_id", { length: 15 }).notNull(),
	userId: int("user_id").notNull(),
	amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }),
	timestamp: timestamp("timestamp", { mode: 'string' }),
},
(table) => {
	return {
		stripeTransactionTransactionId: primaryKey({ columns: [table.transactionId], name: "StripeTransaction_transaction_id"}),
		transactionId: unique("transaction_id").on(table.transactionId),
	}
});

export const textFile = mysqlTable("TextFile", {
	fileId: int("file_id").notNull(),
	userId: int("user_id").notNull(),
	fileKey: varchar("file_key", { length: 255 }).notNull(),
},
(table) => {
	return {
		textFileFileId: primaryKey({ columns: [table.fileId], name: "TextFile_file_id"}),
	}
});

export const tokenTransaction = mysqlTable("TokenTransaction", {
	transactionId: int("transaction_id").autoincrement().notNull(),
	userId: int("user_id").notNull(),
	amount: decimal("amount", { precision: 10, scale: 2 }),
	timestamp: timestamp("timestamp", { mode: 'string' }),
},
(table) => {
	return {
		tokenTransactionTransactionId: primaryKey({ columns: [table.transactionId], name: "TokenTransaction_transaction_id"}),
		transactionId: unique("transaction_id").on(table.transactionId),
	}
});

export const user = mysqlTable("User", {
	id: int("id").autoincrement().notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	tokens: int("tokens"),
	clerkid: varchar("clerkid", { length: 255 }),
	stripeid: varchar("stripeid", { length: 255 }),
	deleted: tinyint("deleted").default(0),
},
(table) => {
	return {
		userId: primaryKey({ columns: [table.id], name: "User_id"}),
		email: unique("email").on(table.email),
	}
});