import { BasicEntity } from "src/base-entity";
import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, OneToMany } from "typeorm";
import { Employee } from "src/employee/entities/employee.entity";
import { Shift } from "src/shift/entities/shift.entity";
import { Area } from "src/area/entities/area.entity";

@Entity('Department')
export class Department extends BasicEntity {
    @ApiProperty()
    @Column({nullable : false, type: 'varchar'})
    name : string
    
    @ApiProperty()
    @Column({nullable : true})
    umr: number
    
    @OneToMany(()=>Employee, emp=> emp.department)
    employee : Employee[]
    
    @OneToMany(() => Area, area => area.department)
    area : Area []
}
