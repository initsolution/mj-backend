import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Attendance, Employee])],
  controllers: [AttendanceController],
  providers: [AttendanceService, EmployeeService]
})
export class AttendanceModule {}
