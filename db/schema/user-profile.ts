import { relations } from 'drizzle-orm';
import { user } from './auth';
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const department = pgTable('department', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const prefix = pgTable('prefix', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const position = pgTable('position', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userProfile = pgTable('user_profile', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  prefixId: text('prefix_id').references(() => prefix.id),
  firstName: text('first_name'),
  lastName: text('last_name'),
  positionId: text('position_id').references(() => position.id),
  departmentId: text('department_id').references(() => department.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// relation
export const departmentRelations = relations(department, ({ many }) => ({
  userProfiles: many(userProfile),
}));

export const userProfileRelations = relations(userProfile, ({ one }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
  position: one(position, {
    fields: [userProfile.positionId],
    references: [position.id],
  }),
  department: one(department, {
    fields: [userProfile.departmentId],
    references: [department.id],
  }),
  prefix: one(prefix, {
    fields: [userProfile.prefixId],
    references: [prefix.id],
  }),
}));

export const prefixRelations = relations(prefix, ({ many }) => ({
  userProfiles: many(userProfile),
}));

export const positionRelations = relations(position, ({ many }) => ({
  userProfiles: many(userProfile),
}));
