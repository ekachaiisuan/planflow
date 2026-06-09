import { department } from '@/db/schema';
import { uuid } from '@/server/uuid';
import { createTRPCRouter, protectedProcedure } from '@/trpc/server/init';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

export const departmentRouter = createTRPCRouter({
  createDepartment: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: 'Name is required' }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name } = input;

      try {
        const [newDepartment] = await ctx.db
          .insert(department)
          .values({
            id: uuid(),
            name,
          })
          .returning();

        return newDepartment;
      } catch (error) {
        const cause = (error as any)?.cause;

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
});
