// src/subject/subject.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subject, SubjectDocument } from './schemas/subject.schema';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { QueryBuilder } from 'src/common/QueryBuilder/QueryBuilder';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
  ) {}
  async create(
    createSubjectDto: CreateSubjectDto | CreateSubjectDto[],
  ): Promise<Subject | Subject[]> {
    const createOne = async (dto: CreateSubjectDto) => {
      const {
        totalMark,
        mcqMark = 0,
        cqMark = 0,
        practicalMark = 0,
        WR = 0,
      } = dto;

      if (mcqMark + cqMark + practicalMark + WR > totalMark) {
        throw new BadRequestException(`Invalid marks for subject: ${dto.name}`);
      }

      // Each subject knows its class & optional section
      const created = new this.subjectModel(dto);
      return created.save();
    };

    if (Array.isArray(createSubjectDto)) {
      return Promise.all(createSubjectDto.map((dto) => createOne(dto)));
    }

    return createOne(createSubjectDto);
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectModel
      .find()
      .populate('studentClass')
      .populate('mergedWith')
      .exec();
  }

  async findAllSubject(query) {
    const filters: Record<string, any> = {};
    if (query.classId) {
      filters.studentClass = query.classId;
    }

    const qb = new QueryBuilder<SubjectDocument>(this.subjectModel, {
      page: query.page,
      limit: query.limit,
      search: query.search,
      searchFields: ['name'], // search by subject name
      sortField: query.sortField,
      sortOrder: query.sortOrder,
      filters,
    });

    const result = await qb.execute();

    const dataWithPopulate = await this.subjectModel.populate(result.data, [
      { path: 'studentClass' },
      { path: 'mergedWith' },
    ]);

    return {
      ...result,
      data: dataWithPopulate,
    };
  }

  async findOne(id: string): Promise<Subject> {
    const subject = await this.subjectModel
      .findById(id)
      .populate('studentClass')
      .populate('mergedWith')
      .exec();

    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }
  async update(id: string, updateDto: UpdateSubjectDto): Promise<Subject> {
    const {
      totalMark,
      mcqMark = 0,
      cqMark = 0,
      practicalMark = 0,
      WR = 0,
    } = updateDto;

    if (
      totalMark !== undefined &&
      mcqMark + cqMark + practicalMark + WR > totalMark
    ) {
      throw new BadRequestException('Sum of marks cannot exceed total mark');
    }

    const updated = await this.subjectModel
      .findByIdAndUpdate(id, updateDto, {
        new: true,
      })
      .populate('studentClass')
      .populate('mergedWith')
      .exec();

    if (!updated) throw new NotFoundException('Subject not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.subjectModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Subject not found');
  }
}
