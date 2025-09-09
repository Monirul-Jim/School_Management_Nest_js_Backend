import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserRole = 'Admin' | 'Teacher' | 'Student' | 'Guardian' | 'User';
export type UserStatus = 'active' | 'blocked' | 'deleted'; // New status type
export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['Admin', 'Teacher', 'Student', 'Guardian', 'User'], default: 'User' })
  role: UserRole;

  @Prop()
  refreshToken?: string;

  @Prop({ enum: ['active', 'blocked', 'deleted'], default: 'active' }) // New status field
  status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
