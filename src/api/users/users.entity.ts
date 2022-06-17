import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
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

    @Column()
    public password: string
}