import { ApiProperty } from "@nestjs/swagger";
import { BasicEntity } from "src/base-entity";
import { Employee } from "src/employee/entities/employee.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('PayslipBulanan')
export class PayslipBulanan extends BasicEntity {
    @ApiProperty()
    @Column({nullable: true, type : 'date'})
    periode_start ?: string
    
    @ApiProperty()
    @Column({nullable: true, type : 'date'})
    periode_end ?: string
    
    @ApiProperty()
    @Column({nullable: true})
    total_hari_kerja ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    total_hari_masuk ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    total_hari_off ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    total_hari_libur ?: number
}
