import { IsNotEmpty, IsEnum } from 'class-validator';
import type { UserRole } from '../schemas/user.schema';

export class UpdateRoleDto {
  @IsNotEmpty()
  userId: string;

  @IsEnum(['Admin', 'Teacher', 'Student', 'Guardian', 'User'])
  role: UserRole;
}