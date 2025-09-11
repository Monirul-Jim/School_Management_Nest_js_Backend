// src/subject/schemas/subject.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SubjectType } from '../dto/create-subject.dto';
import { StudentClass } from 'src/classes/schemas/student-class.schema';

export type SubjectDocument = Subject & Document;

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'StudentClass', required: true })
  studentClass: Types.ObjectId[] | StudentClass[];

  @Prop({ required: true })
  totalMark: number;

  @Prop({
    type: [String],
    enum: SubjectType,
    default: [SubjectType.MCQ, SubjectType.CQ],
  })
  types: SubjectType[];

  @Prop({ default: 0 })
  mcqMark: number;

  @Prop({ default: 0 })
  cqMark: number;

  @Prop({ default: 0 })
  practicalMark: number;

  @Prop({ default: 0 })
  WR: number;

  @Prop({ type: [Types.ObjectId], ref: 'Subject', default: [] })
  mergedWith: Types.ObjectId[]; // merged subject references
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
