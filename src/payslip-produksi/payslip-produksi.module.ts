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
import { Position } from 'src/position/entities/position.entity';
import { Area } from 'src/area/entities/area.entity';
import { Shift } from 'src/shift/entities/shift.entity';
import { DetailShift } from 'src/detail-shift/entities/detail-shift.entity';
import { PositionService } from 'src/position/position.service';
import { AreaService } from 'src/area/area.service';
import { ShiftService } from 'src/shift/shift.service';
import { DetailShiftService } from 'src/detail-shift/detail-shift.service';

@Module({
  imports : [TypeOrmModule.forFeature([AttendanceProduksi, Employee, Department, PayslipProduksi, Loan, Position, Area, Shift, DetailShift])],
  controllers: [PayslipProduksiController],
  providers: [PayslipProduksiService, AttendanceProduksiService, EmployeeService, DepartmentService, LoansService, 
    PositionService, AreaService, ShiftService, DetailShiftService]
})
export class PayslipProduksiModule {}
