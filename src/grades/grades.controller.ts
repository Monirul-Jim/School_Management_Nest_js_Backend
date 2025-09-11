import { Body, Controller, Patch, Param, Get } from '@nestjs/common';
import { AssignMarksDto } from './dto/create-grade.dto';
import { GradeService } from './grades.service';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradeService: GradeService) {}

  @Patch('marks')
  async assignMarks(@Body() dto: AssignMarksDto) {
    return this.gradeService.assignMarks(dto);
  }

  @Get(':assignSubjectId')
  async getMarks(@Param('assignSubjectId') assignSubjectId: string) {
    return this.gradeService.getMarksByAssignment(assignSubjectId);
  }
}
