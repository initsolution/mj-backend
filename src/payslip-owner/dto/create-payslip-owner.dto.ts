import { ApiProperty } from "@nestjs/swagger"


export class CreatePayslipOwnerDto {
    
    @ApiProperty()
    periode_start ?: Date
    
    @ApiProperty()
    periode_end? : Date
}
