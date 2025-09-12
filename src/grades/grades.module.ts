import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { GradesController } from './grades.controller';
import { AssignSubject, AssignSubjectSchema } from 'src/assign/schemas/assign-subject.schema';
import { StudentMark, StudentMarkSchema } from './schemas/grade.schema';
import { GradeService } from './grades.service';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentMark.name, schema: StudentMarkSchema },
      { name: AssignSubject.name, schema: AssignSubjectSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'secret',
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES || '1d' },
    }),
  ],
  controllers: [GradesController],
  providers: [GradeService, RolesGuard], // ✅ RolesGuard must be a provider
})
export class GradesModule {}
