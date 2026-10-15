import { ApiProperty } from "@nestjs/swagger"

export class UpdatePayslipProduksiTambahPendapatanLainDto {
    @ApiProperty()
    idPayslip : number
    
    @ApiProperty()
    pendapatan_lain: number
    
    @ApiProperty()
    departemen? : string
}
