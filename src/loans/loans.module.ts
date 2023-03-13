import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { Loan } from './entities/loan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { Department } from 'src/department/entities/department.entity';
import { DepartmentService } from 'src/department/department.service';
import { Position } from 'src/position/entities/position.entity';
import { PositionService } from 'src/position/position.service';
import { Area } from 'src/area/entities/area.entity';
import { AreaService } from 'src/area/area.service';
import { Shift } from 'src/shift/entities/shift.entity';
import { DetailShift } from 'src/detail-shift/entities/detail-shift.entity';
import { ShiftService } from 'src/shift/shift.service';
import { DetailShiftService } from 'src/detail-shift/detail-shift.service';

@Module({
  imports : [TypeOrmModule.forFeature([ Employee, Loan, Employee, Department, Position, Area, Shift, DetailShift])],
  controllers: [LoansController],
  providers: [LoansService, EmployeeService, EmployeeService, DepartmentService, PositionService, AreaService, ShiftService, DetailShiftService]
})
export class LoansModule {}
