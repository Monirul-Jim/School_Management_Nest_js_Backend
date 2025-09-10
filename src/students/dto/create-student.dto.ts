import { IsOptional, IsString, IsNotEmpty, IsEnum, IsNumber, IsEmail, MinLength, IsDateString } from 'class-validator';

export class CreateStudentDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  fatherName: string;

  @IsString()
  @IsNotEmpty()
  motherName: string;

  @IsString()
  @IsNotEmpty()
  presentAddress: string;

  @IsString()
  @IsNotEmpty()
  permanentAddress: string;

  @IsString()
  @IsNotEmpty()
  guardianNumber: string;

  @IsOptional()
  @IsString()
  localGuardianName?: string;

  @IsOptional()
  @IsString()
  localGuardianNumber?: string;

  @IsOptional()
  @IsEnum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
  bloodGroup?: string;

  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsNotEmpty()
  @IsEnum(['Male', 'Female'])
  gender: string;

  @IsOptional()
  @IsNumber()
  classRole?: number; 

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  // ✅ Added date of birth validation
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;
}
