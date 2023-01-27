import { Module } from '@nestjs/common';
import { AttendanceProduksiService } from './attendance-produksi.service';
import { AttendanceProduksiController } from './attendance-produksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceProduksi } from './entities/attendance-produksi.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';

@Module({
  imports : [TypeOrmModule.forFeature([AttendanceProduksi, Employee])],
  controllers: [AttendanceProduksiController],
  providers: [AttendanceProduksiService, EmployeeService]
})
export class AttendanceProduksiModule {}
