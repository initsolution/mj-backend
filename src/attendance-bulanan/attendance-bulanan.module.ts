import { Module } from '@nestjs/common';
import { AttendanceBulananService } from './attendance-bulanan.service';
import { AttendanceBulananController } from './attendance-bulanan.controller';
import { AttendanceBulanan } from './entities/attendance-bulanan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports : [TypeOrmModule.forFeature([AttendanceBulanan])],
  controllers: [AttendanceBulananController],
  providers: [AttendanceBulananService]
})
export class AttendanceBulananModule {}
