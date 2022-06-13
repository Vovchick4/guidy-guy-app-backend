import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { Photo } from '../photo/photo.entity';

@Entity()
export class Place {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ type: 'varchar', length: 120, primary: true })
    public name: string;

    @Column({ type: 'boolean' })
    public like: boolean;

    @Column({ type: 'varchar', generated: 'uuid' })
    public uuid: string;

    // Relaiton to Photos
    @JoinColumn({ name: 'avatarId' })
    @OneToOne(
        () => Photo,
        {
            nullable: true
        }
    )
    public photo?: Photo;

    @Column({ nullable: true })
    public photoId?: number;
}