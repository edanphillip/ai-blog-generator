import { connect } from "@planetscale/database"
import { Column, ColumnBaseConfig, ColumnDataType, eq } from "drizzle-orm"
import { MySqlTable } from "drizzle-orm/mysql-core"
import { drizzle } from "drizzle-orm/planetscale-serverless"

const connection = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD
})
const db = drizzle(connection)
export default async function getconflicts(table: MySqlTable, column: Column<ColumnBaseConfig<ColumnDataType, string>, object, object>, comparison: any) {
  const conflicts = await db.select()
    .from(table)
    .where(eq(column, comparison))
  return conflicts
}