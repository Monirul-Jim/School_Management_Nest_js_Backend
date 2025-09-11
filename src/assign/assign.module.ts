import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignService } from './assign.service';
import { AssignController } from './assign.controller';
import { AssignSubject, AssignSubjectSchema } from './schemas/assign-subject.schema';
import { Student, StudentSchema } from 'src/students/schemas/student.schema';
import { Subject, SubjectSchema } from 'src/subject/schemas/subject.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssignSubject.name, schema: AssignSubjectSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Subject.name, schema: SubjectSchema },
    ]),
  ],
  controllers: [AssignController],
  providers: [AssignService],
})
export class AssignModule {}
