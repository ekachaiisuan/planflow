import { eq } from 'drizzle-orm';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { count } from '@/db/schema';
import { TRPCError } from '@trpc/server';
import { uuid } from '@/server/uuid';
import z from 'zod';

export const countRouter = createTRPCRouter({
  createCount: protectedProcedure.mutation(async ({ ctx }) => {
    // check if a count exists for the current user
    const existingCount = await ctx.db.query.count.findFirst({
      where: eq(count.userId, ctx.user.id),
    });

    // if one exists throw an error
    if (existingCount)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Count already exists for this user',
      });

    // if it doesn't then create one
    await ctx.db.insert(count).values({
      id: uuid(),
      count: 1,
      userId: ctx.user.id,
    });
  }),
  deleteCount: protectedProcedure.mutation(async ({ ctx }) => {
    // check if a count exists for the current user
    const existingCount = await ctx.db.query.count.findFirst({
      where: eq(count.userId, ctx.user.id),
    });
    // if one doesn't exist throw an error
    if (!existingCount)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No count found for this user',
      });

    await ctx.db.delete(count).where(eq(count.userId, ctx.user.id));
  }),
  getCount: baseProcedure
    .input(z.object({ countId: z.string() }))
    .query(async ({ ctx, input }) => {
      // query the db to find the count with has the same countId
      const existingCount = await ctx.db.query.count.findFirst({
        where: eq(count.id, input.countId),
      });
      // if no count exists, then throw an error
      if (!existingCount)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No count found with this id',
        });
      // if a count with that id exists, return it
      return existingCount;
    }),
    updateCount: protectedProcedure.input(z.object({ isIncreasing: z.boolean()})).mutation(async ({ ctx, input }) => {
      // check if a count exists for the current user
      const existingCount = await ctx.db.query.count.findFirst({
        where: eq(count.userId, ctx.user.id),
      });
      // if one doesn't exist throw an error
      if (!existingCount)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No count found for this user',
        });
      // if it does exist, update it
      await ctx.db.update(count).set({ count: input.isIncreasing ? existingCount.count + 1 : existingCount.count - 1 }).where(eq(count.userId, ctx.user.id)); 
    }),
});
