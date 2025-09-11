import { Controller, Post, Body } from '@nestjs/common';
import { AssignService } from './assign.service';
import { AssignSubjectDto } from './dto/assign-subject.dto';

@Controller('assign')
export class AssignController {
  constructor(private readonly assignService: AssignService) {}

  @Post()
  async assignSubjects(@Body() dto: AssignSubjectDto) {
    return this.assignService.assignSubjects(dto);
  }
}
