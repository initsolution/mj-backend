import { ApiProperty } from "@nestjs/swagger"
import { BasicEntity } from "src/base-entity"
import { Employee } from "src/employee/entities/employee.entity"
import { Entity, Column, ManyToOne } from "typeorm"

@Entity('PayslipHelper')
export class PayslipHelper extends BasicEntity {
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
    
    @ApiProperty()
    @Column({nullable: true})
    lama_kerja ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    gaji_pokok ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    upah_1_hari ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    upah_n_hari ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    extra_full ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    total_pendapatan ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    potongan_terlambat_ijin ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    potongan_bpjs_tk ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    potongan_bpjs_ks ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    potongan_spsi ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    potongan_bon ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    potongan_lain ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    total_potongan ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    pendapatan_gaji ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    sisa_bon ?: number
    
    @ManyToOne(()=> Employee, emp => emp.attendancePyHelper)
    employee ?: Employee
}
