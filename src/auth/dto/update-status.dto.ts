
import { IsNotEmpty, IsEnum } from 'class-validator';
import type { UserStatus } from '../schemas/user.schema';

export class UpdateStatusDto {
  @IsNotEmpty()
  userId: string;

  @IsEnum(['active', 'blocked', 'deleted'])
  status: UserStatus;
}
