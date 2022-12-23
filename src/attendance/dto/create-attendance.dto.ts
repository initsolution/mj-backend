import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber } from "class-validator"
import { Employee } from "src/employee/entities/employee.entity"

export class CreateAttendanceDto {
    @ApiPropertyOptional()
    employee ?: Employee
    
    @ApiPropertyOptional()
    attendance_date ?: Date
    
    @ApiPropertyOptional()
    // @IsNumber()
    attendance_type ?: number
    
    @ApiPropertyOptional()
    time_check_in ?: Date
    
    @ApiPropertyOptional()
    time_check_out ?: Date
    
    @ApiPropertyOptional()
    time_start_for_break ?: Date
    
    @ApiPropertyOptional()
    time_end_for_break ?: Date
    
    @ApiPropertyOptional()
    time_start_for_left ?: Date
    
    @ApiPropertyOptional()
    time_end_for_left ?: Date
    
    @ApiPropertyOptional()
    time_arrive_home ?: Date
    
    @ApiPropertyOptional()
    // @IsNumber()
    overtime ?: number
    
    @ApiPropertyOptional()
    // @IsNumber()
    work_duration ?: number
    
    @ApiPropertyOptional()
    // @IsNumber()
    early_overtime ?: number
    
    @ApiPropertyOptional()
    // @IsNumber()
    total_leave ?: string
    
    @ApiPropertyOptional()
    week_of_day ?: number
    
    @ApiPropertyOptional({description : '1 = ya, 0 = tidak'})
    isOvertime ?: number
    
    @ApiPropertyOptional({description : '1 = ya, 0 = tidak'})
    is_early_overtime ?: number
}
export class CreateManyAttendanceDto{
    @ApiPropertyOptional()
    bulk?: CreateAttendanceDto[];
}