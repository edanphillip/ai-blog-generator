import { db } from './db';
import { Column, ColumnBaseConfig, ColumnDataType, eq } from "drizzle-orm";
import { MySqlTable } from "drizzle-orm/mysql-core";

export async function getDatabaseMatches(table: MySqlTable, column: Column<ColumnBaseConfig<ColumnDataType, string>, object, object>, comparison: any) {

  const conflicts = await db.select()
    .from(table)
    .where(eq(column, comparison));
  return conflicts;
}
