import { ApiProperty } from "@nestjs/swagger";
import { AttendanceBulanan } from "src/attendance-bulanan/entities/attendance-bulanan.entity";
import { AttendanceHelper } from "src/attendance-helper/entities/attendance-helper.entity";
import { BasicEntity } from "src/base-entity";
import { Shift } from "src/shift/entities/shift.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity('DetailShift')
export class DetailShift extends BasicEntity {
    @ApiProperty()
    @Column()
    days : number
    
    @ApiProperty()
    @Column({default : 1})
    active : number
    
    @ApiProperty()
    @Column({type: 'varchar', length : 15})
    work_hours : string
    
    @ApiProperty()
    @Column({type: 'varchar', length : 15})
    break_hours : string
    
    @ApiProperty()
    @Column({type: 'time'})
    start : string
    
    @ApiProperty()
    @Column({type: 'time', nullable : true})
    start_break ?: string
    
    @ApiProperty()
    @Column({type: 'time', nullable : true})
    end_break ?: string
    
    @ApiProperty()
    @Column({type: 'time'})
    end : string 
    
    @ApiProperty()
    @Column({type : 'double'})
    break_duration_h : number
    
    @ApiProperty()
    @Column({})
    break_duration_m : number
    
    @ApiProperty({description : 'if 0 not flexible, 1 is flexible'})
    @Column({default : 0})
    is_flexible : number
    
    @ManyToOne(()=> Shift, shift => shift.detailShift)
    shift: Shift
    
    @OneToMany(()=>AttendanceHelper, att=> att.detailShift)
    attendanceHelper: AttendanceHelper
    
    @OneToMany(()=>AttendanceBulanan, att=> att.detailShift)
    attendanceBulanan: AttendanceBulanan
}
