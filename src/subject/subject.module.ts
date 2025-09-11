// src/subject/subject.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { Subject, SubjectSchema } from './schemas/subject.schema';
import { StudentClass, StudentClassSchema } from 'src/classes/schemas/student-class.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subject.name, schema: SubjectSchema },
      { name: StudentClass.name, schema: StudentClassSchema },
    ]),
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
