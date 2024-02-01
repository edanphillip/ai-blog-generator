import { Column, ColumnBaseConfig, ColumnDataType, and, eq } from "drizzle-orm";
import { MySqlTable } from "drizzle-orm/mysql-core";
import { db } from './db';

export async function getDatabaseMatches(table: MySqlTable, column: Column<ColumnBaseConfig<ColumnDataType, string>, object, object>, comparison: any) {

  const conflicts = await db.select()
    .from(table)
    .where(eq(column, comparison));
  return conflicts;
}
export async function getDatabaseMatches2(table: MySqlTable, column: Column<ColumnBaseConfig<ColumnDataType, string>, object, object>, comparison: any, column2: Column<ColumnBaseConfig<ColumnDataType, string>, object, object>, comparison2: any) {

  const conflicts = await db.select()
    .from(table)
    .where(and(eq(column, comparison), eq(column2, comparison2)));
  return conflicts;
}
