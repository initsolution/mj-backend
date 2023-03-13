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
import { Position } from 'src/position/entities/position.entity';
import { Area } from 'src/area/entities/area.entity';
import { PositionService } from 'src/position/position.service';
import { AreaService } from 'src/area/area.service';
import { Department } from 'src/department/entities/department.entity';
import { DepartmentService } from 'src/department/department.service';

@Module({
  imports : [TypeOrmModule.forFeature([AttendanceBulanan, Employee, Shift, DetailShift, Position, Area, Department])],
  controllers: [AttendanceBulananController],
  providers: [AttendanceBulananService, EmployeeService, ShiftService, DetailShiftService, PositionService, AreaService, DepartmentService]
})
export class AttendanceBulananModule {}
