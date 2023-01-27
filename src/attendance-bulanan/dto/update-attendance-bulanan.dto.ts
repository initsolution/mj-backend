import { PartialType } from '@nestjs/swagger';
import { CreateAttendanceBulananDto } from './create-attendance-bulanan.dto';

export class UpdateAttendanceBulananDto extends PartialType(CreateAttendanceBulananDto) {}
