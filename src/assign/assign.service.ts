import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssignSubjectDto } from './dto/assign-subject.dto';
import { Student } from 'src/students/schemas/student.schema';
import { Subject } from 'src/subject/schemas/subject.schema';
import { Types } from 'mongoose';
@Injectable()
export class AssignService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Subject.name) private subjectModel: Model<Subject>
  ) {}

 

async assignSubjects(dto: AssignSubjectDto) {
  const student = await this.studentModel.findById(dto.studentId);
  if (!student) throw new NotFoundException('Student not found');

  // fetch subjects that belong to student's class
  const subjects = await this.subjectModel.find({
    _id: { $in: dto.subjectIds.map(id => new Types.ObjectId(id)) },
    studentClass: dto.classId,
  });

  if (!subjects.length) throw new NotFoundException('No subjects found for this class');

  // assign subjects
  student.subjects = subjects.map(s => s._id);

  // optional main/fourth subject
  if (dto.mainSubjectId) student.mainSubject = new Types.ObjectId(dto.mainSubjectId);
  if (dto.fourthSubjectId) student.fourthSubject = new Types.ObjectId(dto.fourthSubjectId);

  await student.save();
  return student;
}

}
