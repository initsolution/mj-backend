import { ApiProperty } from "@nestjs/swagger"

export class UpdatePayslipBulananTambahanLainDto {
    @ApiProperty()
    idPayslip : number
    
    @ApiProperty()
    tambahan_gaji_lain: number
    
    @ApiProperty()
    departemen? : string
}