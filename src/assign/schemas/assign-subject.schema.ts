import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Subject } from 'src/subject/schemas/subject.schema';
import { Student } from 'src/students/schemas/student.schema';
import { StudentClass } from 'src/classes/schemas/student-class.schema';

// ✅ Define document type
export type AssignSubjectDocument = AssignSubject & Document;

@Schema({ timestamps: true })
export class AssignSubject {
  @Prop({ type: Types.ObjectId, ref: Student.name, required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: StudentClass.name, required: true })
  classId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: Subject.name, default: [] })
  subjectIds: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: Subject.name, required: false })
  mainSubjectId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Subject.name, required: false })
  fourthSubjectId?: Types.ObjectId;
  // ✅ New field: dynamic marks
  @Prop({
    type: [
      {
        subjectId: { type: Types.ObjectId, ref: Subject.name },
        // use Map so we can store ANY mark type dynamically
        marks: { type: Map, of: Number, default: {} },
      },
    ],
    default: [],
  })
  marks: {
    subjectId: Types.ObjectId;
    marks: Map<string, number>;
  }[];
}

export const AssignSubjectSchema = SchemaFactory.createForClass(AssignSubject);
