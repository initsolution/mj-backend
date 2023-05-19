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
    @Column({nullable: true, type : 'double'})
    total_hari_kerja ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    total_hari_masuk ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    total_hari_off ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    total_hari_libur ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    gaji_pokok ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    tunjangan_jabatan ?: number // lama kerja
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    insentif_extra ?: number // lama kerja
        
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    extra_tambahan_kerja ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    tambahan_gaji_lain ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    total_pendapatan ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    potongan_hari_kerja ?: number //telat+ijin
    
    @ApiProperty()
    @Column({nullable: true})
    potongan_bpjs_tk ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    potongan_bpjs_ks ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    potongan_bon ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    total_potongan ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    pendapatan_gaji ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    sisa_bon ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    lembur ?: number
    
    @ManyToOne(()=> Employee, emp => emp.attendancePyBulanan)
    employee ?: Employee
}
