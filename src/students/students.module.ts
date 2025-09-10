// src/students/students.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import { StudentService } from './students.service';
import { StudentController } from './students.controller';
import { ClassesModule } from 'src/classes/classes.module'; // ✅ import ClassesModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    ClassesModule,
  ],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
