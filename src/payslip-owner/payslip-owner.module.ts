import { Module } from '@nestjs/common';
import { PayslipOwnerService } from './payslip-owner.service';
import { PayslipOwnerController } from './payslip-owner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from 'src/area/entities/area.entity';
import { Department } from 'src/department/entities/department.entity';
import { DetailShift } from 'src/detail-shift/entities/detail-shift.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Loan } from 'src/loans/entities/loan.entity';
import { PayslipBulanan } from 'src/payslip-bulanan/entities/payslip-bulanan.entity';
import { Position } from 'src/position/entities/position.entity';
import { Shift } from 'src/shift/entities/shift.entity';
import { PayslipOwner } from './entities/payslip-owner.entity';
import { PayslipBulananService } from 'src/payslip-bulanan/payslip-bulanan.service';
import { EmployeeService } from 'src/employee/employee.service';
import { LoansService } from 'src/loans/loans.service';
import { DepartmentService } from 'src/department/department.service';
import { PositionService } from 'src/position/position.service';
import { AreaService } from 'src/area/area.service';
import { DetailShiftService } from 'src/detail-shift/detail-shift.service';
import { ShiftService } from 'src/shift/shift.service';
import { AttendanceBulanan } from 'src/attendance-bulanan/entities/attendance-bulanan.entity';
import { AttendanceBulananService } from 'src/attendance-bulanan/attendance-bulanan.service';
@Module({
  imports : [TypeOrmModule.forFeature([PayslipOwner, Employee, Department, PayslipBulanan, Loan, Position, Area, Shift, DetailShift, AttendanceBulanan])],
  controllers: [PayslipOwnerController],
  providers: [PayslipOwnerService, EmployeeService, PayslipBulananService, LoansService, 
    DepartmentService, PositionService, AreaService, ShiftService, DetailShiftService, AttendanceBulananService]
})
export class PayslipOwnerModule {}
