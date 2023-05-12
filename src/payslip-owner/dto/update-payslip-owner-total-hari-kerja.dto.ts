import { ApiProperty } from "@nestjs/swagger"


export class UpdatePayslipOwnerTotalHariMasuk {
    @ApiProperty()
    idPayslip : number
    
    @ApiProperty()
    total_hari_masuk ?: number
    
}