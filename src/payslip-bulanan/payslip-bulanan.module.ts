import { Module } from '@nestjs/common';
import { PayslipBulananService } from './payslip-bulanan.service';
import { PayslipBulananController } from './payslip-bulanan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from 'src/area/entities/area.entity';
import { AttendanceBulanan } from 'src/attendance-bulanan/entities/attendance-bulanan.entity';
import { Department } from 'src/department/entities/department.entity';
import { DetailShift } from 'src/detail-shift/entities/detail-shift.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Loan } from 'src/loans/entities/loan.entity';
import { Position } from 'src/position/entities/position.entity';
import { Shift } from 'src/shift/entities/shift.entity';
import { PayslipBulanan } from './entities/payslip-bulanan.entity';
import { AttendanceBulananService } from 'src/attendance-bulanan/attendance-bulanan.service';
import { AreaService } from 'src/area/area.service';
import { DepartmentService } from 'src/department/department.service';
import { DetailShiftService } from 'src/detail-shift/detail-shift.service';
import { EmployeeService } from 'src/employee/employee.service';
import { LoansService } from 'src/loans/loans.service';
import { PositionService } from 'src/position/position.service';
import { ShiftService } from 'src/shift/shift.service';

@Module({
  imports : [TypeOrmModule.forFeature([AttendanceBulanan, Employee, Department, PayslipBulanan, Loan, Position, Area, Shift, DetailShift])],
  controllers: [PayslipBulananController],
  providers: [PayslipBulananService , AttendanceBulananService, EmployeeService, DepartmentService, LoansService, 
    PositionService, AreaService, ShiftService, DetailShiftService]
})
export class PayslipBulananModule {}
