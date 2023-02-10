import { ApiPropertyOptional } from "@nestjs/swagger"
import { Employee } from "src/employee/entities/employee.entity"
import { Shift } from "src/shift/entities/shift.entity"
import { Column } from "typeorm"

export class CreateAttendanceHelperDto {
    @ApiPropertyOptional({description : 'untuk tanggal absen'})
    attendance_date ?: string
    
    @ApiPropertyOptional()
    attendance_type ?: number
    
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
    @Column({nullable : true})
    work_duration ?: number
    
    @ApiPropertyOptional({description : 'a,b,c|d -> a=telat masuk, b=telat masuk setelah istirahat, c=pulang sebelum waktu, d=ijin'})
    total_leave ?: string
    
    @ApiPropertyOptional()
    work_hours ?: string
    
    @ApiPropertyOptional()
    break_hours ?: string
    
    @ApiPropertyOptional()
    week_of_day ?:number
    
    @ApiPropertyOptional({description : 'ijin/ganti'})
    status_shift ?: string
    
    @ApiPropertyOptional()
    employee ?: Employee
    
    @ApiPropertyOptional()
    shift ?: Shift
}
export class CreateManyAttendanceHelperDto{
    @ApiPropertyOptional()
    bulk?: CreateAttendanceHelperDto[];
}
