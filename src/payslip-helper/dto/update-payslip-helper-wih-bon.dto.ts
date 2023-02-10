import { ApiProperty } from "@nestjs/swagger"
import { Employee } from "src/employee/entities/employee.entity"

export class UpdatePayslipHelperWithBonDto {
    @ApiProperty()
    idPayslip : number
    
    @ApiProperty({description : 'pinjam/bayar'})
    type ?: string
    
    @ApiProperty()
    nominal ?: number
    
    @ApiProperty()
    note? : string
    
    @ApiProperty()
    employee? : Employee
    
    @ApiProperty()
    departemen? : string
    
    @ApiProperty()
    periode_start ?: string
    
    @ApiProperty()
    periode_end? : string
}