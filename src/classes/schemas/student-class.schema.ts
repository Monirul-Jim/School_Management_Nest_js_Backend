// src/student-class/schemas/student-class.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentClassDocument = StudentClass & Document;

@Schema({ timestamps: true })
export class StudentClass {
  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Student' }] })
  students: Types.ObjectId[];
}

export const StudentClassSchema = SchemaFactory.createForClass(StudentClass);
