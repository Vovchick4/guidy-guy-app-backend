import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Place } from '../places/places.entity';

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({
        type: 'bytea',
        nullable: true,
        default: null,
    })
    data: Uint8Array;

    @Column()
    filename: string
}