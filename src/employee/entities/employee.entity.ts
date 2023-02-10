import { ApiProperty } from "@nestjs/swagger";
import { Area } from "src/area/entities/area.entity";
import { AttendanceBulanan } from "src/attendance-bulanan/entities/attendance-bulanan.entity";
import { AttendanceHelper } from "src/attendance-helper/entities/attendance-helper.entity";
import { AttendanceProduksi } from "src/attendance-produksi/entities/attendance-produksi.entity";
import { Department } from "src/department/entities/department.entity";
import { Loan } from "src/loans/entities/loan.entity";
import { PayslipHelper } from "src/payslip-helper/entities/payslip-helper.entity";
import { PayslipProduksi } from "src/payslip-produksi/entities/payslip-produksi.entity";
import { Position } from "src/position/entities/position.entity";
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
    @Column({ type: "varchar", length: 50, nullable: true })
    phone_no ?: string
    
    @ApiProperty()
    @Column({ type: "varchar", length: 100, nullable: true })
    address ?: string
    
    @ApiProperty()
    @Column({ type: "varchar", length: 100, nullable: true })
    type ?: string
    
    @ApiProperty()
    @Column({ nullable: false, default : 1 })
    active : number // 1-> true, 0 -> false
    
    @ApiProperty({default : new Date})
    @Column({nullable: true,type : "date"})
    active_date ?: string
    
    @ApiProperty()
    @Column({ type: "varchar", length: 100, nullable: true })
    bpjs_id ?: string
    
    @ApiProperty()
    @Column({ type: "varchar", length: 100, nullable: true })
    npwp_id ?: string
    
    @ApiProperty({default : new Date})
    @Column({nullable: true,type : "date"})
    date_of_birth : string
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    extra_full ?: number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    iuran_bpjs_tk ?: number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    iuran_bpjs_ks ?: number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    iuran_spsi ?: number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    insentif_extra ?: number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    extra_tambahan_kerja ?: number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    gaji_pokok ?: number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    tunjangan_kehadiran ?: number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    owner_rate ?: number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    owner_bonus_khusus ?: number
    
    @ApiProperty()
    @Column({ nullable: false, default : 0 })
    owner_overtime_rate ?: number
    
    @ApiProperty()
    @Column({ type: 'json', nullable: true })
    meta ?:any
    
    @CreateDateColumn({ nullable: true })
    created_at?: Date;

    @UpdateDateColumn({ nullable: true })
    updated_at?: Date;
    
    @OneToMany(()=> AttendanceProduksi, attendance => attendance.employee)
    attendanceProduksi : AttendanceProduksi
    
    @OneToMany(()=> AttendanceBulanan, attendance => attendance.employee)
    attendanceBulanan : AttendanceBulanan
    
    @OneToMany(()=> AttendanceHelper, attendance => attendance.employee)
    attendanceHelper : AttendanceHelper
    
    @ManyToOne(() => Department, dept => dept.employee)
    department: Department
    
    @ManyToOne(()=> Shift, shift=> shift.employee)
    shift: Shift
    
    @ManyToOne(() => Area, area => area.employee)
    area: Area
    
    @ManyToOne(() => Position, pos => pos.employee)
    position: Position
    
    @OneToMany(()=>Loan, loan => loan.employee)
    loan: Loan[]
    
    @OneToMany(()=>PayslipProduksi, pyslp => pyslp.employee)
    attendancePyProd : PayslipProduksi
    
    @OneToMany(()=>PayslipProduksi, pyslp => pyslp.employee)
    attendancePyHelper : PayslipHelper
}
