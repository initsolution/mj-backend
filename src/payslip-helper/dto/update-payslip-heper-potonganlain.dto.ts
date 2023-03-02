import { ApiProperty } from "@nestjs/swagger"

export class UpdatePayslipHelperPotonganDto {
    @ApiProperty()
    idPayslip : number
    
    @ApiProperty()
    potongan_lain: number
    
    @ApiProperty()
    departemen? : string
}
