import { Module } from '@nestjs/common';
import { PayslipProduksiService } from './payslip-produksi.service';
import { PayslipProduksiController } from './payslip-produksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceProduksi } from 'src/attendance-produksi/entities/attendance-produksi.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Department } from 'src/department/entities/department.entity';
import { PayslipProduksi } from './entities/payslip-produksi.entity';
import { DepartmentService } from 'src/department/department.service';
import { AttendanceProduksiService } from 'src/attendance-produksi/attendance-produksi.service';
import { EmployeeService } from 'src/employee/employee.service';
import { Loan } from 'src/loans/entities/loan.entity';
import { LoansService } from 'src/loans/loans.service';

@Module({
  imports : [TypeOrmModule.forFeature([AttendanceProduksi, Employee, Department, PayslipProduksi, Loan])],
  controllers: [PayslipProduksiController],
  providers: [PayslipProduksiService, AttendanceProduksiService, EmployeeService, DepartmentService, LoansService]
})
export class PayslipProduksiModule {}
