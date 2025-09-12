import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AssignSubject } from 'src/assign/schemas/assign-subject.schema';

export type StudentMarkDocument = StudentMark & Document;

@Schema({ timestamps: true })
export class StudentMark {
  @Prop({ type: Types.ObjectId, ref: 'AssignSubject', required: true })
  assignSubjectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop([
    {
      subjectId: { type: Types.ObjectId, ref: 'Subject', required: true },
      marks: { type: Map, of: Number }, // WR, MCQ, Practical, etc.
      totalMark: { type: Number, default: 0 },
    },
  ])
  subjects: { subjectId: Types.ObjectId; marks: Map<string, number>; totalMark: number }[];
}

export const StudentMarkSchema = SchemaFactory.createForClass(StudentMark);
