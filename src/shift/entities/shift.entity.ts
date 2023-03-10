import { ApiProperty } from "@nestjs/swagger";
import { AttendanceBulanan } from "src/attendance-bulanan/entities/attendance-bulanan.entity";
import { AttendanceHelper } from "src/attendance-helper/entities/attendance-helper.entity";
import { BasicEntity } from "src/base-entity";
import { DetailShift } from "src/detail-shift/entities/detail-shift.entity";
import { Employee } from "src/employee/entities/employee.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('Shift')
export class Shift extends BasicEntity {
    
    @ApiProperty()
    @Column({nullable : false, type : 'varchar'})
    name : string
    
    @ApiProperty()
    @Column({default : 0})
    switchable : number
    
    @OneToMany(()=> Employee, emp => emp.shift)
    employee: Employee
    
    @OneToMany(()=> DetailShift, det => det.shift)
    detailShift: DetailShift[]
    
    @OneToMany(()=> AttendanceBulanan, attbl=> attbl.shift)
    attendanceBulanan :AttendanceBulanan
    
    @OneToMany(()=> AttendanceHelper, attbl=> attbl.shift)
    attendanceHelper :AttendanceHelper
}
