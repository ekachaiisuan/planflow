import {createTRPCRouter} from '../init';
import { countRouter } from './count';

export const appRouter = createTRPCRouter({
    count: countRouter,
});

export type AppRouter = typeof appRouter;