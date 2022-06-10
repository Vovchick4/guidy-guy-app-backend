import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Photo } from '../photo/photo.entity';

@Entity()
export class Place {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ type: 'varchar', length: 120, primary: true })
    public name: string;

    @Column({ type: 'boolean' })
    public like: boolean

    // Relaiton to Photos
    @OneToMany(() => Photo, (photo) => photo.place) // note: we will create author property in the Photo class below
    photos: Photo[]
}