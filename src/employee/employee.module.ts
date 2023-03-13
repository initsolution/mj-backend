import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { DepartmentService } from 'src/department/department.service';
import { AreaService } from 'src/area/area.service';
import { PositionService } from 'src/position/position.service';
import { ShiftService } from 'src/shift/shift.service';
import { Department } from 'src/department/entities/department.entity';
import { Area } from 'src/area/entities/area.entity';
import { Position } from 'src/position/entities/position.entity';
import { Shift } from 'src/shift/entities/shift.entity';
import { DetailShift } from 'src/detail-shift/entities/detail-shift.entity';
import { DetailShiftService } from 'src/detail-shift/detail-shift.service';
import { LoansService } from 'src/loans/loans.service';
import { Loan } from 'src/loans/entities/loan.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Employee, Department, Area, 
    Position, Shift, DetailShift, Loan])],
  controllers: [EmployeeController],
  providers: [EmployeeService, DepartmentService, AreaService, PositionService, 
    ShiftService, DetailShiftService, LoansService]
})
export class EmployeeModule {}
