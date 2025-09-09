// src/student-class/schemas/student-class.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentClassDocument = StudentClass & Document;

@Schema({ timestamps: true })
export class StudentClass {
  @Prop()
  name: string;
  @Prop()
  isDeleted:false

}

export const StudentClassSchema = SchemaFactory.createForClass(StudentClass);
