import { ApiProperty } from "@nestjs/swagger"
import { Shift } from "src/shift/entities/shift.entity"

export class CreateDetailShiftDto {
    
    @ApiProperty()
    days : number
    
    @ApiProperty({default : 1})
    active : number
    
    @ApiProperty({example : '07:00-16:00'})
    work_hours : string
    
    @ApiProperty({example : '11:00-12:00'})
    break_hours : string
    
    @ApiProperty()
    start : string
    
    @ApiProperty()
    start_break : string
    
    @ApiProperty()
    end_break : string
    
    @ApiProperty()
    end : string 
    
    @ApiProperty()
    break_duration_h : number
    
    @ApiProperty()
    break_duration_m : number
    
    @ApiProperty({description : 'if 0 not flexible, 1 is flexible', default : 0})
    is_flexible : number
    
    @ApiProperty()
    shift: Shift
}
