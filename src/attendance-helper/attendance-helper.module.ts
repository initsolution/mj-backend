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
import { Area } from 'src/area/entities/area.entity';
import { Department } from 'src/department/entities/department.entity';
import { Position } from 'src/position/entities/position.entity';
import { PositionService } from 'src/position/position.service';
import { AreaService } from 'src/area/area.service';
import { DepartmentService } from 'src/department/department.service';

@Module({
  imports : [TypeOrmModule.forFeature([AttendanceHelper, Employee, Shift, DetailShift, Position, Area, Department])],
  controllers: [AttendanceHelperController],
  providers: [AttendanceHelperService, EmployeeService, ShiftService, DetailShiftService, PositionService, AreaService, DepartmentService]
})
export class AttendanceHelperModule {}
