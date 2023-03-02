import { ApiProperty } from "@nestjs/swagger"

export class UpdatePayslipProduksiPotonganDto {
    @ApiProperty()
    idPayslip : number
    
    @ApiProperty()
    potongan_lain: number
    
    @ApiProperty()
    departemen? : string
}
