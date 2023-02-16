import { Module } from '@nestjs/common';
import { AttendanceBulananService } from './attendance-bulanan.service';
import { AttendanceBulananController } from './attendance-bulanan.controller';
import { AttendanceBulanan } from './entities/attendance-bulanan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/employee/entities/employee.entity';

@Module({
  imports : [TypeOrmModule.forFeature([AttendanceBulanan, Employee])],
  controllers: [AttendanceBulananController],
  providers: [AttendanceBulananService]
})
export class AttendanceBulananModule {}
