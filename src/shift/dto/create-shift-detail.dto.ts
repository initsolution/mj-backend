import { ApiProperty } from "@nestjs/swagger"
import { CreateDetailShiftDto } from "src/detail-shift/dto/create-detail-shift.dto"

export class CreateShiftDetailDTO {

    @ApiProperty()
    name: string

    @ApiProperty()
    switchable: number
    
    @ApiProperty({
        type: [CreateDetailShiftDto]
    })
    shiftDetail : CreateDetailShiftDto[]
}