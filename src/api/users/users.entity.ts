import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import Role from '../auth/role.enum';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column({ type: 'varchar', length: 120 })
    public userName: string;

    @Column({ unique: true })
    public email: string;

    @Column({ type: 'enum', enum: Role, default: Role.user })
    public role: Role;

    @Column({ type: 'date', default: null })
    public verify_at: string;

    @Column({
        nullable: true
    })
    @Exclude()
    public currentHashedRefreshToken?: string;

    @Column()
    public password: string
}