import { BasicEntity } from "src/base-entity";
import { Column, Entity } from "typeorm";

@Entity('User')
export class User extends BasicEntity {
    @Column({ type: "varchar", length: 100, nullable: false })
    nama : string
    
    @Column({ type: "varchar", length: 100, nullable: true })
    email ?: string
    
    @Column({ type: "varchar", length: 10, nullable: true })
    role ?: string //admin, owner
    
    @Column({ type: "varchar", length: 100, nullable: true })
    password ?: string
}
