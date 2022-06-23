import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToMany } from 'typeorm';
import { Geometry, Point } from 'geojson';
import { Quest } from '../quest/quest.entity';
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

    @Column({
        type: "geography",
        spatialFeatureType: "Point",
        srid: 4326,
        nullable: true
    })
    public coordinates: Point

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

    @ManyToMany(() => Quest, quest => quest.places)
    public quests: Quest[]
}