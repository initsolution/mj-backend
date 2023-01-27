import { Module } from '@nestjs/common';
import { AttendanceBulananService } from './attendance-bulanan.service';
import { AttendanceBulananController } from './attendance-bulanan.controller';

@Module({
  controllers: [AttendanceBulananController],
  providers: [AttendanceBulananService]
})
export class AttendanceBulananModule {}
