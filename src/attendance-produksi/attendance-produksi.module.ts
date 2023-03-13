import { Module } from '@nestjs/common';
import { AttendanceProduksiService } from './attendance-produksi.service';
import { AttendanceProduksiController } from './attendance-produksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceProduksi } from './entities/attendance-produksi.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { Department } from 'src/department/entities/department.entity';
import { DepartmentService } from 'src/department/department.service';
import { Position } from 'src/position/entities/position.entity';
import { Area } from 'src/area/entities/area.entity';
import { Shift } from 'src/shift/entities/shift.entity';
import { DetailShift } from 'src/detail-shift/entities/detail-shift.entity';
import { PositionService } from 'src/position/position.service';
import { AreaService } from 'src/area/area.service';
import { ShiftService } from 'src/shift/shift.service';
import { DetailShiftService } from 'src/detail-shift/detail-shift.service';

@Module({
  imports : [TypeOrmModule.forFeature([AttendanceProduksi, Employee, Department, Position, Area, Shift, DetailShift])],
  controllers: [AttendanceProduksiController],
  providers: [AttendanceProduksiService, EmployeeService, DepartmentService, PositionService, AreaService, ShiftService, DetailShiftService]
})
export class AttendanceProduksiModule {}
