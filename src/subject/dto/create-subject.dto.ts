// src/subject/dto/create-subject.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsMongoId, IsNumber, Min, Max, IsEnum, ValidateIf } from 'class-validator';

export enum SubjectType {
  MCQ = 'MCQ',
  CQ = 'CQ',
  PRACTICAL = 'PRACTICAL',
  WR = 'WR',
}

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  @IsNotEmpty()
  studentClass: string;

  @IsNumber()
  @Min(1)
  totalMark: number;

  @IsEnum(SubjectType, { each: true })
  types: SubjectType[]; // e.g., ['MCQ', 'CQ']

  @ValidateIf(o => o.types.includes(SubjectType.MCQ))
  @IsNumber()
  @Min(0)
  mcqMark: number;

  @ValidateIf(o => o.types.includes(SubjectType.CQ))
  @IsNumber()
  @Min(0)
  cqMark: number;

  @ValidateIf(o => o.types.includes(SubjectType.PRACTICAL))
  @IsNumber()
  @Min(0)
  practicalMark: number;
  
  @ValidateIf(o => o.types.includes(SubjectType.WR))
  @IsNumber()
  @Min(0)
  WR: number;

  @IsOptional()
  mergedWith?: string[]; // array of subject IDs for merged subjects
}
