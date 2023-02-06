import { ApiProperty } from "@nestjs/swagger";
import { BasicEntity } from "src/base-entity";
import { Employee } from "src/employee/entities/employee.entity";
import { Shift } from "src/shift/entities/shift.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('AttendanceBulanan')
export class AttendanceBulanan extends BasicEntity {
    @ApiProperty({description : 'untuk tanggal absen'})
    @Column({ type: 'date' })
    attendance_date : string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_check_in ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_check_out ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_start_for_break ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_end_for_break ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_start_for_left ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_end_for_left ?: string
    
    
    @ApiProperty()
    @Column({nullable : true})
    overtime ?: number
    
    @ApiProperty()
    @Column({nullable : true})
    work_duration ?: number
    
    @ApiProperty({description : 'a,b,c|d -> a=telat masuk, b=telat masuk setelah istirahat, c=pulang sebelum waktu, d=ijin'})
    @Column({nullable : true, type : 'varchar'})
    total_leave ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'varchar'})
    work_hours ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'varchar'})
    break_hours ?: string
    
    @ApiProperty({description : 'ijin/tukar jadwal'})
    @Column({nullable : true, type : 'varchar'})
    status ?: string
    
    @ManyToOne(()=> Employee, empl => empl.attendanceBulanan)
    employee : Employee
    
    @ManyToOne(()=>Shift, shift => shift.attendanceBulanan)
    shift: Shift
}
