import { relations } from 'drizzle-orm'

import { account, session, user } from './auth'

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}))

// Content tables (practice_areas, blog_posts, portfolio_projects) have no
// cross-table foreign keys, so they define no relations.
