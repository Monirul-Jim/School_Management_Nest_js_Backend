// src/student-class/student-class.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { CreateStudentClassDto } from './dto/create-student-class.dto';
import { UpdateStudentClassDto } from './dto/update-student-class.dto';
import { ClassesService } from './classes.service';
import { StudentClass } from './schemas/student-class.schema';

@Controller('class')
export class ClassesController {
  constructor(private readonly studentClassService: ClassesService) {}

  @Post()
  create(@Body() createDto: CreateStudentClassDto) {
    return this.studentClassService.create(createDto);
  }

 @Get()
findAll(
  @Query('page') page?: number,
  @Query('limit') limit?: number,
  @Query('search') search?: string,
  @Query('sortField') sortField?: keyof StudentClass,
  @Query('sortOrder') sortOrder?: 'asc' | 'desc',
) {
  return this.studentClassService.findAll(page ? +page : 1, limit ? +limit : 10, search, sortField, sortOrder);
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentClassService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateStudentClassDto) {
    return this.studentClassService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentClassService.remove(id);
  }
}
