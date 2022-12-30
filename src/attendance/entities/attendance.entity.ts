import { ApiProperty } from "@nestjs/swagger";
import { BasicEntity } from "src/base-entity";
import { Employee } from "src/employee/entities/employee.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('Attendance')
export class Attendance extends BasicEntity {
    @ApiProperty({description : 'untuk tanggal absen'})
    @Column({ type: 'date' })
    attendance_date : Date
    
    @ApiProperty()
    @Column({nullable : true})
    attendance_type ?: number
    
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
    @Column({nullable : true, type : 'time'})
    time_arrive_home ?: string
    
    @ApiProperty()
    @Column({nullable : true})
    overtime ?: number
    
    @ApiProperty()
    @Column({nullable : true})
    work_duration ?: number
    
    @ApiProperty()
    @Column({nullable : true})
    early_overtime ?: number
    
    @ApiProperty({description : 'a,b,c|d -> a=telat masuk, b=telat masuk setelah istirahat, c=pulang sebelum waktu, d=ijin'})
    @Column({nullable : true, type : 'varchar'})
    total_leave ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'varchar'})
    work_hours ?: string
    
    @ApiProperty()
    @Column({nullable : true, type : 'varchar'})
    break_hours ?: string
    
    @ApiProperty({description : '1 = ya, 0 = tidak'})
    @Column({nullable : true, default : 0})
    isOvertime ?: number
    
    @ApiProperty({description : '1 = ya, 0 = tidak'})
    @Column({nullable : true, default : 0})
    is_early_overtime ?: number
    
    @ManyToOne(()=> Employee, empl => empl.attendance)
    employee : Employee
    
}
