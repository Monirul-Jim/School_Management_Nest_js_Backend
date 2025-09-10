// src/schemas/class.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Class extends Document {
  @Prop({ required: true })
  name: string; // e.g. "Class 10-A"

  @Prop()
  section?: string; // optional section

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Student' }] })
  students: Types.ObjectId[]; // relation to students
}

export const ClassSchema = SchemaFactory.createForClass(Class);
