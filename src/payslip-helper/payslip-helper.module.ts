import { Module } from '@nestjs/common';
import { PayslipHelperService } from './payslip-helper.service';
import { PayslipHelperController } from './payslip-helper.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentService } from 'src/department/department.service';
import { Department } from 'src/department/entities/department.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { Loan } from 'src/loans/entities/loan.entity';
import { LoansService } from 'src/loans/loans.service';
import { PayslipHelper } from './entities/payslip-helper.entity';
import { AttendanceHelperService } from 'src/attendance-helper/attendance-helper.service';
import { AttendanceHelper } from 'src/attendance-helper/entities/attendance-helper.entity';
import { Shift } from 'src/shift/entities/shift.entity';
import { ShiftService } from 'src/shift/shift.service';
import { DetailShift } from 'src/detail-shift/entities/detail-shift.entity';
import { DetailShiftService } from 'src/detail-shift/detail-shift.service';
import { Position } from 'src/position/entities/position.entity';
import { PositionService } from 'src/position/position.service';
import { Area } from 'src/area/entities/area.entity';
import { AreaService } from 'src/area/area.service';

@Module({
  imports : [TypeOrmModule.forFeature([AttendanceHelper, Employee, Department, PayslipHelper, Loan, Shift, DetailShift, Position, Area])],
  controllers: [PayslipHelperController],
  providers: [PayslipHelperService, AttendanceHelperService, EmployeeService, DepartmentService, LoansService, ShiftService, DetailShiftService, PositionService, AreaService]
})
export class PayslipHelperModule {}
