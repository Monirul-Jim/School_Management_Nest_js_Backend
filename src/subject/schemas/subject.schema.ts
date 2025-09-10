import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Master list of subjects
export type SubjectDocument = Subject & Document;

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);

// --- Assigned Subject Schema (Junction Table) ---
export type AssignedSubjectDocument = AssignedSubject & Document;

@Schema({ timestamps: true })
export class AssignedSubject {
  @Prop({ type: Types.ObjectId, ref: 'StudentClass', required: true })
  classId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subjectId: Types.ObjectId;

  // Handles subjects like "Bangla 1" and "Bangla 2"
  @Prop()
  part?: string;

  // Defines the marks breakdown (e.g., MCQ, CQ, Practical)
  @Prop([
    {
      type: { type: String, enum: ['MCQ', 'CQ', 'Practical', 'Interview'] },
      marks: { type: Number, required: true },
    },
  ])
  examParts: { type: 'MCQ' | 'CQ' | 'Practical' | 'Interview'; marks: number }[];

  // For Class 9 and 10 optional/fourth subject logic
  @Prop({ enum: ['mandatory', 'optional', 'main'], default: 'mandatory' })
  subjectType: 'mandatory' | 'optional' | 'main';
}

export const AssignedSubjectSchema = SchemaFactory.createForClass(AssignedSubject);

// Create a unique compound index to prevent duplicate subject assignments per class
AssignedSubjectSchema.index({ classId: 1, subjectId: 1, part: 1 }, { unique: true });
