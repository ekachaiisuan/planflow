import 'server-only';
import { cache } from 'react';
import { appRouter } from './routers/_app';
import { createTRPCContext } from './init';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { makeQueryClient } from '../client/query-client';

// เมื่อได้ข้อมูลใหม่แล้วบอกว่าของเก่ามัน out แล้ว
export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});
