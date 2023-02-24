import { Module } from '@nestjs/common';
import { AttendanceBulananService } from './attendance-bulanan.service';
import { AttendanceBulananController } from './attendance-bulanan.controller';
import { AttendanceBulanan } from './entities/attendance-bulanan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Shift } from 'src/shift/entities/shift.entity';
import { ShiftService } from 'src/shift/shift.service';
import { DetailShift } from 'src/detail-shift/entities/detail-shift.entity';
import { DetailShiftService } from 'src/detail-shift/detail-shift.service';

@Module({
  imports : [TypeOrmModule.forFeature([AttendanceBulanan, Employee, Shift, DetailShift])],
  controllers: [AttendanceBulananController],
  providers: [AttendanceBulananService, EmployeeService, ShiftService, DetailShiftService]
})
export class AttendanceBulananModule {}
