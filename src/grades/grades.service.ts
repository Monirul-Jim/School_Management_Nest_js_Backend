import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AssignMarksDto } from "./dto/create-grade.dto";
import { AssignSubject, AssignSubjectDocument } from "src/assign/schemas/assign-subject.schema";
import { StudentMark, StudentMarkDocument } from "./schemas/grade.schema";

@Injectable()
export class GradeService {
  constructor(
    @InjectModel(StudentMark.name) private studentMarkModel: Model<StudentMarkDocument>,
    @InjectModel(AssignSubject.name) private assignSubjectModel: Model<AssignSubjectDocument>,
  ) {}

  async assignMarks(dto: AssignMarksDto) {
    // Check if assignment exists
    const assignment = await this.assignSubjectModel.findById(dto.assignSubjectId);
    if (!assignment) throw new NotFoundException('Assignment not found');

    // Check if marks record exists, if not create
    let studentMark = await this.studentMarkModel.findOne({
      assignSubjectId: dto.assignSubjectId,
    });

    if (!studentMark) {
      studentMark = await this.studentMarkModel.create({
        assignSubjectId: dto.assignSubjectId,
      });
    }

    // Update marks
    studentMark.mcqMark = dto.mcqMark ?? studentMark.mcqMark;
    studentMark.cqMark = dto.cqMark ?? studentMark.cqMark;
    studentMark.practicalMark = dto.practicalMark ?? studentMark.practicalMark;
    studentMark.WR = dto.WR ?? studentMark.WR;

    studentMark.totalMark =
      (studentMark.mcqMark || 0) +
      (studentMark.cqMark || 0) +
      (studentMark.practicalMark || 0) +
      (studentMark.WR || 0);

    await studentMark.save();
    return studentMark;
  }

  async getMarksByAssignment(assignSubjectId: string) {
    return this.studentMarkModel.findOne({ assignSubjectId });
  }
}
