import { ApiPropertyOptional } from "@nestjs/swagger"

export class UpdateAttendanceHelperByShift{
    
    @ApiPropertyOptional()
    attendance_id : number
    
    @ApiPropertyOptional()
    shift_id : number
    
    @ApiPropertyOptional()
    detail_shift_id : number
}