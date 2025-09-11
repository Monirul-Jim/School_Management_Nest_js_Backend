// src/student/student.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from './schemas/student.schema';
import { QueryBuilder } from 'src/common/QueryBuilder/QueryBuilder';
import { StudentClass } from 'src/classes/schemas/student-class.schema';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(StudentClass.name) private classModel: Model<StudentClass>,
    private jwtService: JwtService,
  ) {}

  async registerStudent(dto: CreateStudentDto) {
    // Only fetch classes that are not deleted
    const cls = await this.classModel.findOne({
      _id: dto.classId,
      isDeleted: { $ne: true }, // ensure it's not deleted
    });

    if (!cls)
      throw new NotFoundException('Class not found or has been deleted');

    // Check if classRole is already taken in this class
    if (dto.classRole) {
      const existing = await this.studentModel.findOne({
        class: dto.classId,
        classRole: dto.classRole,
      });
      if (existing) {
        throw new Error(
          `Class role "${dto.classRole}" is already assigned in this class`,
        );
      }
    }

    const student = new this.studentModel({
      ...dto,
      class: dto.classId,
    });

    await student.save();

    // push student to class
    cls.students.push(student._id as Types.ObjectId);
    await cls.save();

    return student;
  }

  async getAllStudents(params: {
    page?: number;
    limit?: number;
    search?: string;
    sortField?: keyof Student;
    sortOrder?: 'asc' | 'desc';
    classId?: string;
    bloodGroup?: string;
  }) {
    const qb = new QueryBuilder<Student>(this.studentModel, {
      page: params.page,
      limit: params.limit || 10,
      search: params.search,
      searchFields: ['firstName', 'lastName', 'fatherName', 'motherName'],
      sortField: params.sortField || 'firstName',
      sortOrder: params.sortOrder || 'asc',
      filters: {
        ...(params.classId
          ? { class: new Types.ObjectId(params.classId) }
          : {}),
        ...(params.bloodGroup ? { bloodGroup: params.bloodGroup } : {}),
      },
    });

    const result = await qb.execute();

    // Populate 'class' details
    const populatedStudents = await this.studentModel.populate(result.data, {
      path: 'class',
      select: 'name',
    });

    return {
      ...result,
      data: populatedStudents,
    };
  }

  async updateStudent(id: string, dto: UpdateStudentDto) {
    const student = await this.studentModel.findById(id);
    if (!student) throw new NotFoundException('Student not found');

    // If class is updated
    if (dto.classId && dto.classId !== student.class.toString()) {
      const newClass = await this.classModel.findById(dto.classId);
      if (!newClass) throw new NotFoundException('Class not found');

      // Remove student from old class
      const oldClass = await this.classModel.findById(student.class);
      if (oldClass) {
        oldClass.students = oldClass.students.filter(
          (sid) =>
            sid.toString() !== (student._id as Types.ObjectId).toString(),
        );

        await oldClass.save();
      }

      // Add to new class
      newClass.students.push(student._id as Types.ObjectId);
      await newClass.save();

      student.class = newClass._id;
    }

    // If classRole is updated
    if (dto.classRole && dto.classRole !== student.classRole) {
      const conflict = await this.studentModel.findOne({
        class: student.class,
        classRole: dto.classRole,
        _id: { $ne: student._id },
      });
      if (conflict) throw new BadRequestException('Class role already taken');
      student.classRole = dto.classRole;
    }

    // Update other fields
    for (const key of Object.keys(dto)) {
      if (key !== 'classId' && key !== 'classRole' && dto[key] !== undefined) {
        student[key] = dto[key];
      }
    }

    await student.save();
    return student.populate('class'); // populate class info
  }
  async getStudentById(id: string) {
    return this.studentModel.findById(id).populate('class');
  }
  private async getTokens(studentId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: studentId, email },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRES,
        },
      ),
      this.jwtService.signAsync(
        { sub: studentId, email },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRES,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const student = await this.studentModel.findOne({ email }).exec();
    if (!student) throw new UnauthorizedException('Invalid email');
    if (student.password !== password)
      throw new UnauthorizedException('Invalid password');

    const tokens = await this.getTokens(student.toString(), student.email);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      student: {
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        role: student.role,
      },
    };
  }
}
