import { ApiPropertyOptional } from "@nestjs/swagger"
import { Employee } from "src/employee/entities/employee.entity"
import { Shift } from "src/shift/entities/shift.entity"

export class CreateAttendanceBulananDto {
    @ApiPropertyOptional()
    attendance_date ?: string
    
    @ApiPropertyOptional()
    time_check_in ?: string
    
    @ApiPropertyOptional()
    time_check_out ?: string
    
    @ApiPropertyOptional()
    time_start_for_break_1 ?: string
    
    @ApiPropertyOptional()
    time_end_for_break_1 ?: string
    
    @ApiPropertyOptional()
    time_start_for_break_2 ?: string
    
    @ApiPropertyOptional()
    time_end_for_break_2 ?: string
    
    @ApiPropertyOptional()
    time_start_for_left_1 ?: string
    
    @ApiPropertyOptional()
    time_end_for_left_1 ?: string
    
    @ApiPropertyOptional()
    time_start_for_left_2 ?: string
    
    @ApiPropertyOptional()
    time_end_for_left_2 ?: string
    
    @ApiPropertyOptional()
    time_start_for_left_3 ?: string
    
    @ApiPropertyOptional()
    time_end_for_left_3 ?: string
    
    @ApiPropertyOptional()
    work_duration ?: number
    
    @ApiPropertyOptional()
    total_leave ?: string
    
    @ApiPropertyOptional()
    work_hours ?: string
    
    @ApiPropertyOptional()
    break_hours ?: string
    
    @ApiPropertyOptional({description : 'ijin/ganti'})
    status_shift ?: string
    
    @ApiPropertyOptional({type : Employee})
    employee ?: Employee
    
    @ApiPropertyOptional({type : Shift})
    shift?: Shift
}
export class CreateManyAttendanceBulananDto{
    @ApiPropertyOptional()
    bulk?: CreateAttendanceBulananDto[];
}