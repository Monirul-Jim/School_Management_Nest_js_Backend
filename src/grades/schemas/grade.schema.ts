import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AssignSubject } from 'src/assign/schemas/assign-subject.schema';

export type StudentMarkDocument = StudentMark & Document;

@Schema({ timestamps: true })
export class StudentMark {
  @Prop({ type: Types.ObjectId, ref: AssignSubject.name, required: true })
  assignSubjectId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  mcqMark: number;

  @Prop({ type: Number, default: 0 })
  cqMark: number;

  @Prop({ type: Number, default: 0 })
  practicalMark: number;

  @Prop({ type: Number, default: 0 })
  WR: number;

  @Prop({ type: Number, default: 0 })
  totalMark: number;
}

export const StudentMarkSchema = SchemaFactory.createForClass(StudentMark);
