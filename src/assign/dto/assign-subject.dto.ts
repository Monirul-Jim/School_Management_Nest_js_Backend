// assign/dto/assign-subject.dto.ts
import { IsString, IsMongoId, IsOptional, IsBoolean } from 'class-validator';

export class AssignSubjectDto {
  @IsMongoId()
  studentId: string;

  @IsMongoId()
  classId: string;

  @IsMongoId({ each: true })
  subjectIds: string[]; // subjects to assign

  @IsOptional()
  @IsMongoId()
  mainSubjectId?: string; // optional, mark one as main

  @IsOptional()
  @IsMongoId()
  fourthSubjectId?: string; // optional, mark one as fourth
}
