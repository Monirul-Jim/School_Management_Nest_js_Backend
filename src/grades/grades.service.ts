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
    const filters: Record<string, any> = {};
    if (queryParams.classId) filters.classId = queryParams.classId;
    if (queryParams.studentId)
      filters.studentId = new Types.ObjectId(queryParams.studentId);

    const qb = new QueryBuilder<AssignSubjectDocument>(
      this.assignSubjectModel,
      {
        page: queryParams.page,
        limit: queryParams.limit,
        search: queryParams.search,
        searchFields: ['studentId', 'subjectIds'],
        filters,
        sortField: queryParams.sortField || 'createdAt',
        sortOrder: queryParams.sortOrder || 'desc',
      },
    );

    const result = await qb.execute();

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

        const marks =
          (populated?.marks || []).map((m: any) => ({
            ...m,
            marks: m.marks
              ? Object.fromEntries(
                  Object.entries(m.marks).map(([k, v]) => [k, v]),
                )
              : {}, // fallback to empty object
          })) || [];

        return {
          ...populated,
          marks,
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

async updateMarks(
  assignSubjectId: string,
  marksInput: Record<string, Record<string, number>>, // { subjectId: { WR: 20, MCQ: 10 } }
) {
  const assign = await this.assignSubjectModel.findById(assignSubjectId);
  if (!assign) throw new Error('Assignment not found');

  // Loop through input subjects
  Object.entries(marksInput).forEach(([subjectId, markObj]) => {
    const subjectMarks = assign.marks.find(
      (m) => m.subjectId.toString() === subjectId,
    );

    if (subjectMarks) {
      // merge existing marks into the Map
      Object.entries(markObj).forEach(([type, value]) => {
        subjectMarks.marks.set(type, value); // ✅ use Map.set
      });
    } else {
      // create a new Map for new subject
      assign.marks.push({
        subjectId: new Types.ObjectId(subjectId),
        marks: new Map(Object.entries(markObj)), // ✅ convert object to Map
      });
    }
  });

  return assign.save();
}

}
