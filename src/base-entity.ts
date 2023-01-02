import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
export class BasicEntity {
    @PrimaryGeneratedColumn()
    id?: number;
    
    @CreateDateColumn({ nullable: true })
    created_at?: Date;

    @UpdateDateColumn({ nullable: true })
    updated_at?: Date;
}