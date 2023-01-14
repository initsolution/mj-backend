import { ApiProperty } from "@nestjs/swagger"
import { Area } from "src/area/entities/area.entity"

export class CreatePositionDto {
    @ApiProperty()
    name: string
    
    @ApiProperty()
    area:Area
}
