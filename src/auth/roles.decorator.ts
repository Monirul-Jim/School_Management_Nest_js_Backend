// src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type UserRole = 'Admin' | 'Teacher' | 'Student' | 'Guardian' | 'User';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
