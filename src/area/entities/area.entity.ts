import { ApiProperty } from "@nestjs/swagger";
import { BasicEntity } from "src/base-entity";
import { Department } from "src/department/entities/department.entity";
import { Employee } from "src/employee/entities/employee.entity";
import { Position } from "src/position/entities/position.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity('Area')
export class Area extends BasicEntity {
    @ApiProperty()
    @Column({ type: "varchar", length: 100, nullable: false })
    name: string
    
    @ManyToOne(() => Department, dept => dept.area)
    department: Department
    
    @OneToMany(()=> Position, pos => pos.area)
    position: Position[]
    
    @OneToMany(()=> Employee, emp => emp.area)
    employee : Employee[]
}
