import { department, prefix, position, userProfile } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/server/init';
import { TRPCError } from '@trpc/server';
import { asc, eq } from 'drizzle-orm';
import z from 'zod';

const profileSchema = z.object({
  prefixId: z.string().min(1, { message: 'Prefix is required' }),
  firstName: z.string().trim().min(1, { message: 'First name is required' }),
  lastName: z.string().trim().min(1, { message: 'Last name is required' }),
  positionId: z.string().min(1, { message: 'Position is required' }),
  departmentId: z.string().min(1, { message: 'Department is required' }),
});

export const userProfileRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.query.userProfile.findFirst({
      where: eq(userProfile.userId, ctx.user.id),
      columns: {
        prefixId: true,
        firstName: true,
        lastName: true,
        positionId: true,
        departmentId: true,
      },
    });

    return profile ?? null;
  }),

  prefixOptions: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({ id: prefix.id, name: prefix.name })
      .from(prefix)
      .orderBy(asc(prefix.name));
  }),

  positionOptions: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({ id: position.id, name: position.name })
      .from(position)
      .orderBy(asc(position.name));
  }),

  departmentOptions: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({ id: department.id, name: department.name })
      .from(department)
      .orderBy(asc(department.name));
  }),

  save: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const [saved] = await ctx.db
          .insert(userProfile)
          .values({
            userId: ctx.user.id,
            prefixId: input.prefixId,
            firstName: input.firstName,
            lastName: input.lastName,
            positionId: input.positionId,
            departmentId: input.departmentId,
          })
          .onConflictDoUpdate({
            target: userProfile.userId,
            set: {
              prefixId: input.prefixId,
              firstName: input.firstName,
              lastName: input.lastName,
              positionId: input.positionId,
              departmentId: input.departmentId,
            },
          })
          .returning();

        return saved;
      } catch (error) {
        const cause = (error as { cause?: { code?: string } })?.cause;

        if (cause?.code === '23503') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Selected position or department no longer exists',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to save profile',
        });
      }
    }),
});
