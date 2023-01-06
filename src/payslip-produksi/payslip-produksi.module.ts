import { Module } from '@nestjs/common';
import { PayslipProduksiService } from './payslip-produksi.service';
import { PayslipProduksiController } from './payslip-produksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Department } from 'src/department/entities/department.entity';
import { PayslipProduksi } from './entities/payslip-produksi.entity';
import { DepartmentService } from 'src/department/department.service';
import { AttendanceService } from 'src/attendance/attendance.service';
import { EmployeeService } from 'src/employee/employee.service';
import { Loan } from 'src/loans/entities/loan.entity';
import { LoansService } from 'src/loans/loans.service';

@Module({
  imports : [TypeOrmModule.forFeature([Attendance, Employee, Department, PayslipProduksi, Loan])],
  controllers: [PayslipProduksiController],
  providers: [PayslipProduksiService, AttendanceService, EmployeeService, DepartmentService, LoansService]
})
export class PayslipProduksiModule {}
