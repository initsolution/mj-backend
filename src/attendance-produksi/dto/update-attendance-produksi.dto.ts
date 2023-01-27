import { PartialType } from '@nestjs/swagger';
import { CreateAttendanceProduksiDto } from './create-attendance-produksi.dto';

export class UpdateAttendanceProduksiDto extends PartialType(CreateAttendanceProduksiDto) {}
