import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttendanceBulananService } from './attendance-bulanan.service';
import { CreateAttendanceBulananDto } from './dto/create-attendance-bulanan.dto';
import { UpdateAttendanceBulananDto } from './dto/update-attendance-bulanan.dto';

@Controller('attendance-bulanan')
export class AttendanceBulananController {
  constructor(private readonly attendanceBulananService: AttendanceBulananService) {}

  @Post()
  create(@Body() createAttendanceBulananDto: CreateAttendanceBulananDto) {
    return this.attendanceBulananService.create(createAttendanceBulananDto);
  }

  @Get()
  findAll() {
    return this.attendanceBulananService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceBulananService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendanceBulananDto: UpdateAttendanceBulananDto) {
    return this.attendanceBulananService.update(+id, updateAttendanceBulananDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceBulananService.remove(+id);
  }
}
