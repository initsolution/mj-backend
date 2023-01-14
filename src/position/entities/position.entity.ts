import { ApiProperty } from "@nestjs/swagger"
import { Area } from "src/area/entities/area.entity"
import { BasicEntity } from "src/base-entity"
import { Column, Entity, ManyToOne } from "typeorm"

@Entity('Position')
export class Position extends BasicEntity {
    @ApiProperty()
    @Column({ type: "varchar", length: 100, nullable: false })
    name: string
    
    @ManyToOne(() => Area, area => area.position)
    area: Area
}
