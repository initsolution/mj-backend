import { ApiProperty } from "@nestjs/swagger";
import { BasicEntity } from "src/base-entity";
import { DetailShift } from "src/detail-shift/entities/detail-shift.entity";
import { Employee } from "src/employee/entities/employee.entity";
import { Shift } from "src/shift/entities/shift.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('AttendanceBulanan')
export class AttendanceBulanan extends BasicEntity {
    @ApiProperty({description : 'untuk tanggal absen'})
    @Column({ type: 'date' })
    attendance_date : string
    
    @ApiProperty({})
    @Column({ })
    week_of_day ?:number
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_check_in ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_check_out ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_start_for_break_1 ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_end_for_break_1 ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_start_for_break_2 ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_end_for_break_2 ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_start_for_left_1 ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_end_for_left_1 ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_start_for_left_2 ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_end_for_left_2 ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_start_for_left_3 ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'time'})
    time_end_for_left_3 ?: string
    
    @ApiProperty()
    @Column({nullable : true})
    work_duration ?: number
    
    @ApiProperty({description : 'a,b,c,d -> a=telat masuk, b=telat masuk setelah istirahat, c=pulang sebelum waktu, d=ijin'})
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
    status_shift ?: string
    
    @ApiProperty()
    @Column({nullable : true})
    lembur ?: number
    
    @ManyToOne(()=> Employee, empl => empl.attendanceBulanan)
    employee : Employee
    
    @ManyToOne(()=>Shift, shift => shift.attendanceBulanan)
    shift: Shift
    
    @ManyToOne(()=> DetailShift, detShift => detShift.attendanceHelper)
    detailShift ?: DetailShift
}
