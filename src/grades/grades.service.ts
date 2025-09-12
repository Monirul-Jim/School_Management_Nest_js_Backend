import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AssignSubject,
  AssignSubjectDocument,
} from 'src/assign/schemas/assign-subject.schema';
import { StudentMark, StudentMarkDocument } from './schemas/grade.schema';
import { QueryBuilder } from 'src/common/QueryBuilder/QueryBuilder';
import { Types } from 'mongoose';

@Injectable()
export class GradeService {
  constructor(
    @InjectModel(StudentMark.name)
    private studentMarkModel: Model<StudentMarkDocument>,
    @InjectModel(AssignSubject.name)
    private assignSubjectModel: Model<AssignSubjectDocument>,
    @InjectModel(AssignSubject.name)
    private assignedSubjectModel: Model<AssignSubjectDocument>,
  ) {}

  async getAllGrades(queryParams: any) {
    // Build filters for query builder
    const filters: Record<string, any> = {};
    if (queryParams.classId) filters.classId = queryParams.classId;
    if (queryParams.studentId)
      filters.studentId = new Types.ObjectId(queryParams.studentId);

    // Initialize QueryBuilder for assignments
    const qb = new QueryBuilder<AssignSubjectDocument>(
      this.assignSubjectModel,
      {
        page: queryParams.page,
        limit: queryParams.limit,
        search: queryParams.search,
        searchFields: ['studentId', 'subjectIds'], // optional, adjust if needed
        filters,
        sortField: queryParams.sortField || 'createdAt',
        sortOrder: queryParams.sortOrder || 'desc',
      },
    );

    // Execute query
    const result = await qb.execute();

    // Populate students, class, subjects, mainSubjectId, fourthSubjectId
    const populatedData = await Promise.all(
      result.data.map(async (assign: any) => {
        const populated = await this.assignSubjectModel
          .findById(assign._id)
          .populate('studentId')
          .populate('classId')
          .populate('subjectIds')
          .populate('mainSubjectId')
          .populate('fourthSubjectId')
          .lean();

        const studentMark = await this.studentMarkModel
          .findOne({ assignSubjectId: assign._id })
          .lean();
        return {
          ...populated,
          marks: studentMark || null,
        };
      }),
    );

    return {
      total: result.total,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
      data: populatedData,
    };
  }
  
  async upsertMarks(assignSubjectId: string, marksInput: any) {
    const assign = await this.assignSubjectModel
      .findById(assignSubjectId)
      .populate('subjectIds')
      .lean();
    console.log(assignSubjectId, marksInput);
    if (!assign) throw new Error('Assignment not found');

    const subjectsData = Object.entries(marksInput).map(
      ([subjectId, markObj]: [string, any]) => {
        const subjectInfo: any = assign.subjectIds.find(
          (s: any) => s._id.toString() === subjectId,
        );
        if (!subjectInfo) throw new Error('Subject not found');

        let total = 0;
        Object.entries(markObj).forEach(([type, value]) => {
          total += Number(value) || 0;
        });

        if (total > (subjectInfo.totalMark || 100)) {
          throw new Error(
            `Total marks for ${subjectInfo.name} cannot exceed ${subjectInfo.totalMark || 100}`,
          );
        }

        return {
          subjectId: new Types.ObjectId(subjectId),
          marks: markObj,
          totalMark: total,
        };
      },
    );

    const existingMark = await this.studentMarkModel.findOne({
      assignSubjectId,
    });
    if (existingMark) {
      existingMark.subjects = subjectsData;
      return existingMark.save();
    } else {
      const newMark = new this.studentMarkModel({
        assignSubjectId,
        studentId: assign.studentId,
        subjects: subjectsData,
      });
      return newMark.save();
    }
  }
}
