import { ApiProperty } from "@nestjs/swagger"

export class CreatePayslipProduksiDto {
    @ApiProperty()
    departemen? : string
    
    @ApiProperty()
    periode_start ?: Date
    
    @ApiProperty()
    periode_end? : Date
    
    @ApiProperty()
    day_off ?: [Date]
}
