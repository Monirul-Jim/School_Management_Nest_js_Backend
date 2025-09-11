import { Module } from '@nestjs/common';
import { AssignService } from './assign.service';
import { AssignController } from './assign.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/students/schemas/student.schema';
import { Subject, SubjectSchema } from 'src/subject/schemas/subject.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Subject.name, schema: SubjectSchema },
    ]),
  ],
  providers: [AssignService],
  controllers: [AssignController],
})
export class AssignModule {}
