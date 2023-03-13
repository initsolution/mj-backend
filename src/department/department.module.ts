import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { Department } from './entities/department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from 'src/loans/entities/loan.entity';
import { LoansService } from 'src/loans/loans.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Position } from 'src/position/entities/position.entity';
import { Area } from 'src/area/entities/area.entity';
import { PositionService } from 'src/position/position.service';
import { AreaService } from 'src/area/area.service';
import { Shift } from 'src/shift/entities/shift.entity';
import { ShiftService } from 'src/shift/shift.service';
import { DetailShiftService } from 'src/detail-shift/detail-shift.service';
import { DetailShift } from 'src/detail-shift/entities/detail-shift.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Department, Loan, Employee, Position, Area, Shift, DetailShift])],
  controllers: [DepartmentController],
  providers: [DepartmentService, LoansService, EmployeeService, PositionService, AreaService, ShiftService, DetailShiftService]
})
export class DepartmentModule {}
