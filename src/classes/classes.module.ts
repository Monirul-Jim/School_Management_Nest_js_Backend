// src/classes/classes.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentClass, StudentClassSchema } from './schemas/student-class.schema';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudentClass.name, schema: StudentClassSchema }])
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [
    MongooseModule // ✅ this exports StudentClassModel to other modules
  ]
})
export class ClassesModule {}
