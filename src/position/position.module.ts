import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { PayslipProduksi } from 'src/payslip-produksi/entities/payslip-produksi.entity';
import { PayslipHelper } from 'src/payslip-helper/entities/payslip-helper.entity';
import { PayslipProduksiService } from 'src/payslip-produksi/payslip-produksi.service';
import { PayslipHelperService } from 'src/payslip-helper/payslip-helper.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { AttendanceProduksi } from 'src/attendance-produksi/entities/attendance-produksi.entity';
import { AttendanceHelper } from 'src/attendance-helper/entities/attendance-helper.entity';
import { AttendanceProduksiService } from 'src/attendance-produksi/attendance-produksi.service';
import { AttendanceHelperService } from 'src/attendance-helper/attendance-helper.service';
import { Department } from 'src/department/entities/department.entity';
import { DepartmentService } from 'src/department/department.service';
import { Loan } from 'src/loans/entities/loan.entity';
import { LoansService } from 'src/loans/loans.service';
import { Area } from 'src/area/entities/area.entity';
import { AreaService } from 'src/area/area.service';
import { Shift } from 'src/shift/entities/shift.entity';
import { ShiftService } from 'src/shift/shift.service';
import { DetailShiftService } from 'src/detail-shift/detail-shift.service';
import { DetailShift } from 'src/detail-shift/entities/detail-shift.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Position, PayslipProduksi, PayslipHelper, Employee, 
    AttendanceProduksi, AttendanceHelper, Department, Loan, Area, Shift, DetailShift])],
  controllers: [PositionController],
  providers: [PositionService, PayslipProduksiService, PayslipHelperService,
     EmployeeService, AttendanceProduksiService, AttendanceHelperService, 
     DepartmentService, LoansService, AreaService, ShiftService, DetailShiftService]
})
export class PositionModule {}
