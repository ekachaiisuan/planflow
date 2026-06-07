import { user } from './auth';
import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const count = pgTable("count", {
  id: text("id").primaryKey(),
  count: integer("count").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});
  