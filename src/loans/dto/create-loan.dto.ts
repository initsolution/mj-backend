import { ApiProperty } from "@nestjs/swagger"
import { Employee } from "src/employee/entities/employee.entity"

export class CreateLoanDto {
    
    @ApiProperty({description : 'pinjam/bayar'})
    type ?: string
    
    @ApiProperty()
    nominal ?: number
    
    @ApiProperty()
    total_loan_before ?: number
    
    @ApiProperty()
    total_loan_current ?: number
    
    @ApiProperty()
    total_pay_before ?: number
    
    @ApiProperty()
    total_pay_current ?: number
    
    @ApiProperty()
    loan_date ?: Date
    
    @ApiProperty()
    note ?: string
    
    @ApiProperty()
    employee : Employee
}
