import { ApiProperty } from "@nestjs/swagger"

export class UpdatePayslipBulananPotonganDto {
    @ApiProperty()
    idPayslip : number
    
    @ApiProperty()
    potongan_lain: number
    
    @ApiProperty()
    departemen? : string
}
