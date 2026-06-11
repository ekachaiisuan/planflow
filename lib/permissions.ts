import { createAccessControl } from 'better-auth/plugins/access';
import {
  defaultStatements,
  userAc,
  adminAc,
} from 'better-auth/plugins/admin/access';

const statements = {
  ...defaultStatements,
  project: ['create', 'read', 'update', 'delete', 'approve'],
  appConfig: ['manage'], // แผนก, ตำแหน่ง, คำนำหน้า
  member: ['manage'],   // จัดการสมาชิกใน workspace
} as const;

export const ac = createAccessControl(statements);

export const user = ac.newRole({
  ...userAc.statements,
  project: ['read'],
});

export const officer = ac.newRole({
  ...userAc.statements,
  project: ['create', 'read', 'update'],
});

export const manager = ac.newRole({
  ...userAc.statements,
  project: ['create', 'read', 'update', 'approve'],
});

export const operator = ac.newRole({
  ...userAc.statements,
  project: ['create', 'read', 'update', 'delete', 'approve'],
  appConfig: ['manage'],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  project: ['create', 'read', 'update', 'delete', 'approve'],
  appConfig: ['manage'],
  member: ['manage'],
});

export const roleMap = {
  user,
  officer,
  manager,
  operator,
  admin,
} as const;

export const ROLES = [
  'user',
  'officer',
  'manager',
  'operator',
  'admin',
] as const;

export type Role = (typeof ROLES)[number];
