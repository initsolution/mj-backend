import { Injectable } from '@nestjs/common';
import { CreateAttendanceBulananDto } from './dto/create-attendance-bulanan.dto';
import { UpdateAttendanceBulananDto } from './dto/update-attendance-bulanan.dto';

@Injectable()
export class AttendanceBulananService {
  create(createAttendanceBulananDto: CreateAttendanceBulananDto) {
    return 'This action adds a new attendanceBulanan';
  }

  findAll() {
    return `This action returns all attendanceBulanan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendanceBulanan`;
  }

  update(id: number, updateAttendanceBulananDto: UpdateAttendanceBulananDto) {
    return `This action updates a #${id} attendanceBulanan`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendanceBulanan`;
  }
}
