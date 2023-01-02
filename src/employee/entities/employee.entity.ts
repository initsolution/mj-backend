import { ApiProperty } from "@nestjs/swagger";
import { Attendance } from "src/attendance/entities/attendance.entity";
import { Department } from "src/department/entities/department.entity";
import { Loan } from "src/loans/entities/loan.entity";
import { PayslipProduksi } from "src/payslip-produksi/entities/payslip-produksi.entity";
import { Shift } from "src/shift/entities/shift.entity";
import { Entity, Column, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne } from "typeorm";

@Entity('Employee')
export class Employee  {
    @ApiProperty()
    @PrimaryColumn('varchar')
    id : string
    
    @ApiProperty()
    @Column({ type: "varchar", length: 100, nullable: false })
    name : string
    
    @ApiProperty()
    @Column({ type: "varchar", length: 20, nullable: true })
    phone_no ?: string
    
    @ApiProperty()
    @Column({ type: "varchar", length: 100, nullable: true })
    address ?: string
    
    @ApiProperty()
    @Column({ nullable: false, default : 1 })
    active : number // 1-> true, 0 -> false
    
    @ApiProperty({default : new Date})
    @Column({nullable: true})
    active_date ?: Date
    
    @ApiProperty()
    @Column({ type: "varchar", length: 100, nullable: true })
    bpjs_id ?: string
    
    @ApiProperty()
    @Column({ type: "varchar", length: 100, nullable: true })
    npwp_id ?: string
    
    @ApiProperty({default : new Date})
    @Column({nullable: true})
    date_of_birth : Date
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    extra_full : number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    iuran_bpjs_tk : number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    iuran_bjs_ks : number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    iuran_spsi : number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    insentif_ekstra : number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    extra_tambahan_kerja : number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    gaji_pokok : number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    tunjangan_kehadiran : number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    owner_rate : number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    owner_bonus_khusus : number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    owner_overtime_rate : number
    
    @ApiProperty()
    @Column({ type: 'json', nullable: true })
    meta :any
    
    @CreateDateColumn({ nullable: true })
    created_at?: Date;

    @UpdateDateColumn({ nullable: true })
    updated_at?: Date;
    
    @OneToMany(()=> Attendance, attendance => attendance.employee)
    attendance : Attendance
    
    @ManyToOne(() => Department, dept => dept.employee)
    department: Department
    
    @ManyToOne(()=> Shift, shift=> shift.employee)
    shift: Shift
    
    
    @OneToMany(()=>Loan, loan => loan.employee)
    loan: Loan[]
    
    @OneToMany(()=>PayslipProduksi, pyslp => pyslp.employee)
    attendancePyProd : PayslipProduksi
}
