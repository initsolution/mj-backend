import { ApiProperty } from "@nestjs/swagger"
import { Department } from "src/department/entities/department.entity"

export class CreateAreaDto {
    @ApiProperty()
    name: string
    
    @ApiProperty()
    department:Department
}
