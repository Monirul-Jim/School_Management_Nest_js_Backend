import { IsMongoId, IsOptional, IsNumber, Min } from 'class-validator';

export class AssignMarksDto {
  @IsMongoId()
  assignSubjectId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  mcqMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cqMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  practicalMark?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  WR?: number;
}
