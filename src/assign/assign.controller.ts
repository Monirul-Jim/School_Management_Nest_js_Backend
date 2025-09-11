import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AssignService } from './assign.service';
import { AssignSubjectDto } from './dto/assign-subject.dto';

@Controller('assign')
export class AssignController {
  constructor(private readonly assignService: AssignService) {}

  @Post()
  async assignSubjects(@Body() dto: AssignSubjectDto) {
    return this.assignService.assignSubjects(dto);
  }
   @Get('pagination')
  async getAllAssignSubjects(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('studentId') studentId?: string,
    @Query('classId') classId?: string,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.assignService.findAllAssignSubjects({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      studentId,
      classId,
      sortField,
      sortOrder,
    });
  }
}
