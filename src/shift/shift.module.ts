import { Module } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { Shift } from './entities/shift.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailShift } from 'src/detail-shift/entities/detail-shift.entity';
import { DetailShiftService } from 'src/detail-shift/detail-shift.service';

@Module({
  imports : [TypeOrmModule.forFeature([Shift, DetailShift])],
  controllers: [ShiftController],
  providers: [ShiftService, DetailShiftService]
})
export class ShiftModule {}
