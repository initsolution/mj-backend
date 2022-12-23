import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateDepartmentDto {
    
    @ApiProperty()
    @IsString({ always: true })
    name : string
    
    @ApiProperty()
    umr: number
}
