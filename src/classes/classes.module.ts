import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { StudentClass, StudentClassSchema } from './schemas/student-class.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudentClass.name, schema: StudentClassSchema }]),
  ],
  providers: [ClassesService],
  controllers: [ClassesController],
})
export class ClassesModule {}
