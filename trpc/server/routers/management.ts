import { TRPCError } from '@trpc/server';
import { desc, eq, sql } from 'drizzle-orm';
import z from 'zod';

import { department, position, prefix, userProfile } from '@/db/schema';
import { uuid } from '@/server/uuid';
import { createTRPCRouter, protectedProcedure } from '@/trpc/server/init';

const isManagementRole = (role: string | null | undefined) =>
  role === 'manager' || role === 'admin';

const managementProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!isManagementRole(ctx.user.role)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
    });
  }

  return next({
    ctx,
  });
});

const formSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
});

const updateSchema = formSchema.extend({
  id: z.string().min(1, { message: 'Id is required' }),
});

const deleteSchema = z.object({
  id: z.string().min(1, { message: 'Id is required' }),
});

export const managementRouter = createTRPCRouter({
  department: createTRPCRouter({
    list: managementProcedure.query(async ({ ctx }) => {
      return await ctx.db
        .select({
          id: department.id,
          name: department.name,
          createdAt: department.createdAt,
        })
        .from(department)
        .orderBy(desc(department.createdAt));
    }),

    create: managementProcedure.input(formSchema).mutation(async ({ ctx, input }) => {
      try {
        const [created] = await ctx.db
          .insert(department)
          .values({
            id: uuid(),
            name: input.name,
          })
          .returning();

        return created;
      } catch (error) {
        const cause = (error as { cause?: { code?: string } })?.cause;

        if (cause?.code === '23505') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Department name already exists',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create department',
        });
      }
    }),

    update: managementProcedure.input(updateSchema).mutation(async ({ ctx, input }) => {
      try {
        const [updated] = await ctx.db
          .update(department)
          .set({
            name: input.name,
          })
          .where(eq(department.id, input.id))
          .returning();

        if (!updated) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Department not found',
          });
        }

        return updated;
      } catch (error) {
        const cause = (error as { cause?: { code?: string } })?.cause;

        if (cause?.code === '23505') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Department name already exists',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update department',
        });
      }
    }),

    delete: managementProcedure.input(deleteSchema).mutation(async ({ ctx, input }) => {
      const [linkedCountRow] = await ctx.db
        .select({
          count: sql<number>`count(*)::int`,
        })
        .from(userProfile)
        .where(eq(userProfile.departmentId, input.id));

      const linkedCount = linkedCountRow?.count ?? 0;

      if (linkedCount > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `Cannot delete department because ${linkedCount} user profile${
            linkedCount === 1 ? '' : 's'
          } still use it`,
        });
      }

      try {
        const [deleted] = await ctx.db
          .delete(department)
          .where(eq(department.id, input.id))
          .returning({
            id: department.id,
          });

        if (!deleted) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Department not found',
          });
        }

        return deleted;
      } catch (error) {
        const cause = (error as { cause?: { code?: string } })?.cause;

        if (cause?.code === '23503') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Cannot delete department because user profiles still use it',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete department',
        });
      }
    }),
  }),

  position: createTRPCRouter({
    list: managementProcedure.query(async ({ ctx }) => {
      return await ctx.db
        .select({
          id: position.id,
          name: position.name,
          createdAt: position.createdAt,
        })
        .from(position)
        .orderBy(desc(position.createdAt));
    }),

    create: managementProcedure.input(formSchema).mutation(async ({ ctx, input }) => {
      try {
        const [created] = await ctx.db
          .insert(position)
          .values({
            id: uuid(),
            name: input.name,
          })
          .returning();

        return created;
      } catch (error) {
        const cause = (error as { cause?: { code?: string } })?.cause;

        if (cause?.code === '23505') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Position name already exists',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create position',
        });
      }
    }),

    update: managementProcedure.input(updateSchema).mutation(async ({ ctx, input }) => {
      try {
        const [updated] = await ctx.db
          .update(position)
          .set({
            name: input.name,
          })
          .where(eq(position.id, input.id))
          .returning();

        if (!updated) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Position not found',
          });
        }

        return updated;
      } catch (error) {
        const cause = (error as { cause?: { code?: string } })?.cause;

        if (cause?.code === '23505') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Position name already exists',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update position',
        });
      }
    }),

    delete: managementProcedure.input(deleteSchema).mutation(async ({ ctx, input }) => {
      const [linkedCountRow] = await ctx.db
        .select({
          count: sql<number>`count(*)::int`,
        })
        .from(userProfile)
        .where(eq(userProfile.positionId, input.id));

      const linkedCount = linkedCountRow?.count ?? 0;

      if (linkedCount > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `Cannot delete position because ${linkedCount} user profile${
            linkedCount === 1 ? '' : 's'
          } still use it`,
        });
      }

      try {
        const [deleted] = await ctx.db
          .delete(position)
          .where(eq(position.id, input.id))
          .returning({
            id: position.id,
          });

        if (!deleted) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Position not found',
          });
        }

        return deleted;
      } catch (error) {
        const cause = (error as { cause?: { code?: string } })?.cause;

        if (cause?.code === '23503') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Cannot delete position because user profiles still use it',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete position',
        });
      }
    }),
  }),

  prefix: createTRPCRouter({
    list: managementProcedure.query(async ({ ctx }) => {
      return await ctx.db
        .select({
          id: prefix.id,
          name: prefix.name,
          createdAt: prefix.createdAt,
        })
        .from(prefix)
        .orderBy(desc(prefix.createdAt));
    }),

    create: managementProcedure.input(formSchema).mutation(async ({ ctx, input }) => {
      try {
        const [created] = await ctx.db
          .insert(prefix)
          .values({
            id: uuid(),
            name: input.name,
          })
          .returning();

        return created;
      } catch (error) {
        const cause = (error as { cause?: { code?: string } })?.cause;

        if (cause?.code === '23505') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Prefix name already exists',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create prefix',
        });
      }
    }),

    update: managementProcedure.input(updateSchema).mutation(async ({ ctx, input }) => {
      try {
        const [updated] = await ctx.db
          .update(prefix)
          .set({
            name: input.name,
          })
          .where(eq(prefix.id, input.id))
          .returning();

        if (!updated) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Prefix not found',
          });
        }

        return updated;
      } catch (error) {
        const cause = (error as { cause?: { code?: string } })?.cause;

        if (cause?.code === '23505') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Prefix name already exists',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update prefix',
        });
      }
    }),

    delete: managementProcedure.input(deleteSchema).mutation(async ({ ctx, input }) => {
      const [linkedCountRow] = await ctx.db
        .select({
          count: sql<number>`count(*)::int`,
        })
        .from(userProfile)
        .where(eq(userProfile.prefixId, input.id));

      const linkedCount = linkedCountRow?.count ?? 0;

      if (linkedCount > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `Cannot delete prefix because ${linkedCount} user profile${
            linkedCount === 1 ? '' : 's'
          } still use it`,
        });
      }

      try {
        const [deleted] = await ctx.db
          .delete(prefix)
          .where(eq(prefix.id, input.id))
          .returning({
            id: prefix.id,
          });

        if (!deleted) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Prefix not found',
          });
        }

        return deleted;
      } catch (error) {
        const cause = (error as { cause?: { code?: string } })?.cause;

        if (cause?.code === '23503') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Cannot delete prefix because user profiles still use it',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete prefix',
        });
      }
    }),
  }),
});
