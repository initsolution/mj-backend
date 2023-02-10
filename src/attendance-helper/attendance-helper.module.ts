import { Module } from '@nestjs/common';
import { AttendanceHelperService } from './attendance-helper.service';
import { AttendanceHelperController } from './attendance-helper.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { AttendanceHelper } from './entities/attendance-helper.entity';
import { ShiftService } from 'src/shift/shift.service';
import { Shift } from 'src/shift/entities/shift.entity';
import { DetailShift } from 'src/detail-shift/entities/detail-shift.entity';
import { DetailShiftService } from 'src/detail-shift/detail-shift.service';

@Module({
  imports : [TypeOrmModule.forFeature([AttendanceHelper, Employee, Shift, DetailShift])],
  controllers: [AttendanceHelperController],
  providers: [AttendanceHelperService, EmployeeService, ShiftService, DetailShiftService]
})
export class AttendanceHelperModule {}
