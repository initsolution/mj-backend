import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
export class BasicEntity {
    @PrimaryGeneratedColumn()
    id?: number;
    
    @CreateDateColumn({ nullable: true })
    created_at?: string;

    @UpdateDateColumn({ nullable: true })
    updated_at?: string;
}