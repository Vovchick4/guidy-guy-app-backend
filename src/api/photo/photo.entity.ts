import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Place } from '../places/places.entity';

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    public id!: number;

    // @Column({
    //     type: 'bytea',
    // })
    // data: Uint8Array;

    @Column()
    filename: string
}