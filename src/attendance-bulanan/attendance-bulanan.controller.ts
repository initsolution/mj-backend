import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttendanceBulananService } from './attendance-bulanan.service';
import { CreateAttendanceBulananDto } from './dto/create-attendance-bulanan.dto';
import { UpdateAttendanceBulananDto } from './dto/update-attendance-bulanan.dto';
import { AttendanceBulanan } from './entities/attendance-bulanan.entity';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  model: {
    type: AttendanceBulanan
  },
  query: {
    join: {
      employee: {},
      shift :{}
    }
  },
  dto: {
    create: CreateAttendanceBulananDto,
    update: UpdateAttendanceBulananDto
  }
})

@ApiTags('Attendance-Bulanan')
@Controller('attendance-bulanan')
export class AttendanceBulananController implements CrudController<AttendanceBulanan> {
  constructor(public service : AttendanceBulananService) {}

  @Get('/customGetAttendance')
  async customGetAttendance(){
    return this.service.getCustomAttendance()
  }
}
