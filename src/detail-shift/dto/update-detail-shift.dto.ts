import { PartialType } from '@nestjs/swagger';
import { CreateDetailShiftDto } from './create-detail-shift.dto';

export class UpdateDetailShiftDto extends PartialType(CreateDetailShiftDto) {}
