import { ApiProperty } from "@nestjs/swagger";
import { BasicEntity } from "src/base-entity";
import { Employee } from "src/employee/entities/employee.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('Loan')
export class Loan extends BasicEntity {
    @ApiProperty({description : 'pinjam/bayar'})
    @Column({default : 'pinjam'})
    type : string
    
    @ApiProperty()
    @Column({default : 0})
    nominal : number
    
    @ApiProperty()
    @Column({default : 0, nullable : true})
    total_loan_before ?: number
    
    @ApiProperty()
    @Column({default : 0, nullable : true})
    total_loan_current ?: number
    
    @ApiProperty()
    @Column({default : 0, nullable : true})
    total_pay_before ?: number
    
    @ApiProperty()
    @Column({default : 0, nullable : true})
    total_pay_current ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    loan_date ?: Date
    
    @ApiProperty()
    @Column({default : '-', nullable : true})
    note ?: string
    
    @ManyToOne(() => Employee, emp => emp.loan)
    employee : Employee
    
}
