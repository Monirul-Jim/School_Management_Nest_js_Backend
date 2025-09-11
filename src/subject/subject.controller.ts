// src/subject/subject.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './schemas/subject.schema';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}
 @Post()
  async create(
    @Body() createSubjectDto: CreateSubjectDto | CreateSubjectDto[],
  ): Promise<Subject | Subject[]> {
    return this.subjectService.create(createSubjectDto);
  }
  @Get()
  async findAll(): Promise<Subject[]> {
    return this.subjectService.findAll();
  }
  @Get('pagination')
  async findAllSSubject(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('classId') classId?: string,
    @Query('sortField') sortField?: keyof Subject,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.subjectService.findAllSubject({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      classId,
      sortField,
      sortOrder,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseMongoIdPipe) id: string): Promise<Subject> {
    return this.subjectService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    return this.subjectService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<{ message: string }> {
    await this.subjectService.remove(id);
    return { message: 'Subject deleted successfully' };
  }
}
