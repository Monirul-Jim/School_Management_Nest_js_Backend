import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GradeService } from './grades.service';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradeService: GradeService) {}
  // Fetch all combined data (students, classes, subjects, and marks)
  @Get()
  async getAllGrades(
    @Query('classId') classId?: string,
    @Query('studentId') studentId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.gradeService.getAllGrades({
      classId,
      studentId,
      page,
      limit,
      search,
      sortField,
      sortOrder,
    });
  }

  @Post('marks/:assignSubjectId')
  async upsertMarks(
    @Param('assignSubjectId') assignSubjectId: string,
    @Body() marksInput: Record<string, Record<string, number>>, // { subjectId: { WR: 20, MCQ: 10 } }
  ) {
    try {
      const result = await this.gradeService.upsertMarks(
        assignSubjectId,
        marksInput,
      );
      return {
        success: true,
        message: 'Marks saved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to save marks',
      };
    }
  }
}
