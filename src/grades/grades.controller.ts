import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GradeService } from './grades.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradeService: GradeService) {}
  // Fetch all combined data (students, classes, subjects, and marks)
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Teacher')
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
  async updateMarks(
    @Param('assignSubjectId') assignSubjectId: string,
    @Body() marksInput: Record<string, Record<string, number>>,
  ) {
    try {
      const result = await this.gradeService.updateMarks(
        assignSubjectId,
        marksInput,
      );
      return {
        success: true,
        message: 'Marks updated successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update marks',
      };
    }
  }
}
