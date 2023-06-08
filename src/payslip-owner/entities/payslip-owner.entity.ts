import { ApiProperty } from "@nestjs/swagger";
import { BasicEntity } from "src/base-entity";
import { Employee } from "src/employee/entities/employee.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('PayslipOwner')
// export class PayslipOwner {
    export class PayslipOwner extends BasicEntity {
    // @PrimaryGeneratedColumn()
    // id?: number;
    
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
    total_buku_1 ?: number 
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    total_potongan_1 ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    sisa_bon ?: number //sisa bon owner
        
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    tambahan ?: number //employee.owner_rate
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    lembur ?: number // employee.owner_overtime_rate
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    bonus_khusus ?: number // employee.owner_bonus_khusus
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    total_buku_2 ?: number 
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    potongan_astek_plus ?: number
    
    @ApiProperty()
    @Column({nullable: true})
    potongan_bon ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    total_potongan_2 ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    total_bersih_buku_1 ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    total_bersih_buku_2 ?: number
    
    @ApiProperty()
    @Column({nullable: true, type : 'double'})
    pendapatan_gaji ?: number
    
    @ManyToOne(()=> Employee, emp => emp.attendancePyOwner)
    employee ?: Employee
}
