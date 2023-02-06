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
    time_start_for_break ?: string
    
    @ApiPropertyOptional()
    time_end_for_break ?: string
    
    @ApiPropertyOptional()
    time_start_for_left ?: string
    
    @ApiPropertyOptional()
    time_end_for_left ?: string
    
    @ApiPropertyOptional()
    overtime ?: number
    
    @ApiPropertyOptional()
    work_duration ?: number
    
    @ApiPropertyOptional()
    total_leave ?: string
    
    @ApiPropertyOptional()
    work_hours ?: string
    
    @ApiPropertyOptional()
    break_hours ?: string
    
    @ApiPropertyOptional()
    status ?: string
    
    @ApiPropertyOptional({type : Employee})
    employee ?: Employee
    
    @ApiPropertyOptional({type : Shift})
    shift?: Shift
}
