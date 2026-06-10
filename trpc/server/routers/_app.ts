import { createTRPCRouter } from '../init';
import { countRouter } from './count';
import { departmentRouter } from './user-profile';
import { managementRouter } from './management';

export const appRouter = createTRPCRouter({
  count: countRouter,
  department: departmentRouter,
  management: managementRouter,
});

export type AppRouter = typeof appRouter;
