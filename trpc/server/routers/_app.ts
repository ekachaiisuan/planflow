import { createTRPCRouter } from '../init';
import { countRouter } from './count';
import { departmentRouter } from './user-profile';

export const appRouter = createTRPCRouter({
  count: countRouter,
  department: departmentRouter,
});

export type AppRouter = typeof appRouter;
