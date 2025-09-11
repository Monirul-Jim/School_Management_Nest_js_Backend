import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { AssignSubjectDto } from './dto/assign-subject.dto';
import { Student } from 'src/students/schemas/student.schema';
import { Subject } from 'src/subject/schemas/subject.schema';
import { AssignSubject, AssignSubjectDocument } from './schemas/assign-subject.schema';
import { QueryBuilder } from 'src/common/QueryBuilder/QueryBuilder';

@Injectable()
export class AssignService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Subject.name) private subjectModel: Model<Subject>,
    @InjectModel(AssignSubject.name) private assignSubjectModel: Model<AssignSubjectDocument>,
  ) {}

  async assignSubjects(dto: AssignSubjectDto) {
    if (!isValidObjectId(dto.studentId)) {
      throw new BadRequestException('Invalid studentId');
    }
    if (!isValidObjectId(dto.classId)) {
      throw new BadRequestException('Invalid classId');
    }

    const student = await this.studentModel.findById(dto.studentId);
    if (!student) throw new NotFoundException('Student not found');

    // Filter valid subjects
    const validSubjectIds = (dto.subjectIds || [])
      .filter((id) => isValidObjectId(id))
      .map((id) => new Types.ObjectId(id));

    if (!validSubjectIds.length) {
      throw new BadRequestException('No valid subjects selected');
    }

    // Fetch subjects for this class
    const subjects = await this.subjectModel.find({
      _id: { $in: validSubjectIds },
      studentClass: dto.classId,
    });

    if (!subjects.length) {
      throw new NotFoundException('No subjects found for this class');
    }

    // ✅ Save assignment in AssignSubject collection
    const assignment = await this.assignSubjectModel.create({
      studentId: dto.studentId,
      classId: dto.classId,
      subjectIds: validSubjectIds,
      mainSubjectId: dto.mainSubjectId ? new Types.ObjectId(dto.mainSubjectId) : undefined,
      fourthSubjectId: dto.fourthSubjectId ? new Types.ObjectId(dto.fourthSubjectId) : undefined,
    });

    return assignment;
  }
  async findAllAssignSubjects(query: {
    page?: number;
    limit?: number;
    search?: string;
    studentId?: string;
    classId?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const filters: Record<string, any> = {};

    if (query.studentId && Types.ObjectId.isValid(query.studentId)) {
      filters.studentId = new Types.ObjectId(query.studentId);
    }
    if (query.classId && Types.ObjectId.isValid(query.classId)) {
      filters.classId = new Types.ObjectId(query.classId);
    }

 const qb = new QueryBuilder<AssignSubjectDocument>(this.assignSubjectModel, {
  page: query.page,
  limit: query.limit,
  search: query.search,
  searchFields: ['studentId'],
  sortOrder: query.sortOrder,
  filters,
});

    const result = await qb.execute();

    const populatedData = await this.assignSubjectModel.populate(result.data, [
      { path: 'studentId', select: 'firstName lastName' },
      { path: 'classId', select: 'name' },
      { path: 'subjectIds', select: 'name' },
      { path: 'mainSubjectId', select: 'name' },
      { path: 'fourthSubjectId', select: 'name' },
    ]);

    return { ...result, data: populatedData };
  }
  
}
