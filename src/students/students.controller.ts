// src/student/student.controller.ts
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentService } from './students.service';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('register')
  async register(@Body() dto: CreateStudentDto) {
    return this.studentService.registerStudent(dto);
  }

  @Get()
  async getAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('classId') classId?: string,
    @Query('bloodGroup') bloodGroup?: string,
  ) {
    return this.studentService.getAllStudents({
      page,
      limit,
      search,
      sortField: sortField as any,
      sortOrder,
      classId,
      bloodGroup,
    });
  }
  
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.updateStudent(id, dto);
  }


  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.studentService.getStudentById(id);
  }
}
