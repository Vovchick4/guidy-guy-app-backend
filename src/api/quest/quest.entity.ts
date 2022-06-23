import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Place } from '../places/places.entity';

@Entity()
export class Quest {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ type: "varchar", length: 120 })
    public name: string

    @Column({ type: "uuid", generated: "uuid" })
    public uuid: string

    @Column({ type: 'int' })
    public userId: number

    @ManyToMany(() => Place, place => place.quests, { eager: true })
    @JoinTable()
    public places: Place[]
}