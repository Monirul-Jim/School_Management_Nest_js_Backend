// src/student-class/student-class.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentClass, StudentClassDocument } from './schemas/student-class.schema';
import { CreateStudentClassDto } from './dto/create-student-class.dto';
import { UpdateStudentClassDto } from './dto/update-student-class.dto';
import { QueryBuilder } from 'src/common/QueryBuilder/QueryBuilder';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(StudentClass.name) private studentClassModel: Model<StudentClassDocument>,
  ) {}

  async create(createDto: CreateStudentClassDto): Promise<StudentClass> {
    const newClass = new this.studentClassModel(createDto);
    return newClass.save();
  }

  async findAll(
    page?: number,
    limit?: number,
    search?: string,
    sortField?: keyof StudentClass,
    sortOrder?: 'asc' | 'desc',
  ) {
    const queryBuilder = new QueryBuilder<StudentClassDocument>(this.studentClassModel, {
      page,
      limit,
      search,
      searchFields: ['name'], // you can add more searchable fields if needed
      sortField,
      sortOrder,
    });

    // Filter out soft-deleted classes
    const result = await queryBuilder.execute();
    result.data = result.data.filter((cls) => !cls.isDeleted);

    return result;
  }

  async findOne(id: string): Promise<StudentClass> {
    const cls = await this.studentClassModel.findOne({ _id: id, isDeleted: false });
    if (!cls) throw new NotFoundException('Student class not found');
    return cls;
  }

  async update(id: string, updateDto: UpdateStudentClassDto): Promise<StudentClass> {
  const updated = await this.studentClassModel.findOneAndUpdate(
    { _id: id },
    updateDto,
    { new: true },
  );
  if (!updated) throw new NotFoundException('Student class not found');
  return updated;
}


 async remove(id: string): Promise<StudentClass> {
  const deleted = await this.studentClassModel.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true },
  );
  if (!deleted) throw new NotFoundException('Student class not found');
  return deleted;
}

}
