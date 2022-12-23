import { ApiProperty } from "@nestjs/swagger"

export class CreateShiftDto {

    @ApiProperty()
    name: string

    @ApiProperty({ default: 0, description: '1 = true, 0 = false. default 1', })
    switchable: number
}
