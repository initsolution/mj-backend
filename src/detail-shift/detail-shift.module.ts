import { Module } from '@nestjs/common';
import { DetailShiftService } from './detail-shift.service';
import { DetailShiftController } from './detail-shift.controller';
import { DetailShift } from './entities/detail-shift.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports : [TypeOrmModule.forFeature([DetailShift])],
  controllers: [DetailShiftController],
  providers: [DetailShiftService]
})
export class DetailShiftModule {}
