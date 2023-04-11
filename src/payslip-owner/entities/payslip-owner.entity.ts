import { ApiProperty } from "@nestjs/swagger";
import { BasicEntity } from "src/base-entity";
import { Employee } from "src/employee/entities/employee.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('PayslipOwner')
export class PayslipOwner {
    @ApiProperty()
    @Column({nullable: true, type : 'date'})
    periode_start ?: string
    
    @ApiProperty()
    @Column({nullable: true, type : 'date'})
    periode_end ?: string
    
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    total_hari_kerja ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    total_hari_masuk ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    total_hari_off ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    total_hari_libur ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    gaji_pokok ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    total_buku_1 ?: number 
    
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    total_potongan_1 ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    sisa_bon ?: number //sisa bon owner
        
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    tambahan ?: number //employee.owner_rate
    
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    lembur ?: number // employee.owner_overtime_rate
    
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    bonus_khusus ?: number // employee.owner_bonus_khusus
    
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    total_buku_2 ?: number 
    
    @ApiProperty()
    @Column({nullable: true})
    potongan_astek_plus ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    potongan_bon ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    total_potongan_2 ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    total_bersih_buku_1 ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    total_bersih_buku_2 ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'float'})
    pendapatan_gaji ?: number
    
    @ManyToOne(()=> Employee, emp => emp.attendancePyOwner)
    employee ?: Employee
}
