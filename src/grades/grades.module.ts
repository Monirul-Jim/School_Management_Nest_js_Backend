import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GradesController } from './grades.controller';
import { AssignSubject, AssignSubjectSchema } from 'src/assign/schemas/assign-subject.schema';
import { StudentMark, StudentMarkSchema } from './schemas/grade.schema';
import { GradeService } from './grades.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentMark.name, schema: StudentMarkSchema },
      { name: AssignSubject.name, schema: AssignSubjectSchema },
    ]),
  ],
  controllers: [GradesController],
  providers: [GradeService],
})
export class GradesModule {}
