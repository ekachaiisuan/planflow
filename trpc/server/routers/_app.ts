import { createTRPCRouter } from '../init';
import { countRouter } from './count';
import { managementRouter } from './management';
import { userProfileRouter } from './user-profile';

export const appRouter = createTRPCRouter({
  count: countRouter,
  management: managementRouter,
  userProfile: userProfileRouter,
});

export type AppRouter = typeof appRouter;
