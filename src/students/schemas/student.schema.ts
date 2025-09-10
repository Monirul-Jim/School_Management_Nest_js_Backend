import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type Gender = 'Male' | 'Female';
export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'O+'
  | 'O-'
  | 'AB+'
  | 'AB-';

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop({ required: true })
  fatherName: string;

  @Prop({ required: true })
  motherName: string;

  @Prop({ required: true })
  presentAddress: string;

  @Prop({ required: true })
  permanentAddress: string;

  @Prop({ required: true })
  guardianNumber: string;

  @Prop()
  localGuardianName?: string;

  @Prop()
  localGuardianNumber?: string;

  @Prop({ enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] })
  bloodGroup?: BloodGroup;

  @Prop({ enum: ['Male', 'Female'], required: true })
  gender: Gender;

  @Prop({ type: Types.ObjectId, ref: 'StudentClass', required: true })
  class: Types.ObjectId;

  @Prop({ type: Number })
  classRole?: number;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // ✅ Added date of birth
  @Prop({ required: true })
  dateOfBirth: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

// Unique index for classRole per class
StudentSchema.index({ class: 1, classRole: 1 }, { unique: true, sparse: true });
