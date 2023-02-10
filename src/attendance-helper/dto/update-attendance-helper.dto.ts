import { PartialType } from '@nestjs/swagger';
import { CreateAttendanceHelperDto } from './create-attendance-helper.dto';

export class UpdateAttendanceHelperDto extends PartialType(CreateAttendanceHelperDto) {}
