import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Place } from '../places/places.entity';

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ type: 'varchar', length: 120, primary: false })
    public name: string;

    @Column("text")
    description: string

    @Column()
    filename: string

    @Column("float")
    views: number

    @Column()
    isPublished: boolean

    // Relaiton to Places
    @ManyToOne(() => Place, (place) => place.photos)
    place: Place
}