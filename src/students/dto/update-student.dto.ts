import { IsOptional, IsString, IsEnum, IsNumber, IsEmail, MinLength, IsDateString } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  motherName?: string;

  @IsOptional()
  @IsString()
  presentAddress?: string;

  @IsOptional()
  @IsString()
  permanentAddress?: string;

  @IsOptional()
  @IsString()
  guardianNumber?: string;

  @IsOptional()
  @IsString()
  localGuardianName?: string;

  @IsOptional()
  @IsString()
  localGuardianNumber?: string;

  @IsOptional()
  @IsEnum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  classId?: string;

  @IsOptional()
  @IsEnum(['Male', 'Female'])
  gender?: string;

  @IsOptional()
  @IsNumber()
  classRole?: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}
