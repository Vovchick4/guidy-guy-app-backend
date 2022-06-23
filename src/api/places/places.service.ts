import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Place } from './places.entity';
import { CreatePlaceDto } from './place.dto';
import createFilter from './filter';
import { IPlaceParams } from './interfaces'
import { PhotoService } from '../photo/photo.service';

@Injectable()
export class PlacesService {
    @InjectRepository(Place)
    private readonly repository: Repository<Place>
    @Inject(PhotoService)
    private readonly photoServices: PhotoService

    public async findPlaceById(id: number): Promise<Place> {
        const findElem = await this.repository.findOne({ where: { id } });

        if (!findElem) {
            throw new HttpException('Not Found Place', HttpStatus.NOT_FOUND)
        }

        return findElem;
    }

    public async findPlace(query: IPlaceParams): Promise<object> {
        const filter = createFilter(query)
        const take = query?.take || 10
        const skip = query?.skip || 0

        const [result, total] = await this.repository.findAndCount({ where: filter, take, skip })
        if (!result) {
            throw new HttpException('Not Found Place', HttpStatus.NOT_FOUND)
        }

        return {
            data: result,
            total
        };
    }

    public async createPlace(body: CreatePlaceDto): Promise<Place> {
        const place: Place = new Place();
        place.name = body.name;
        place.like = body.like;
        return await this.repository.save(place);
    }

    public async uploadPhoto(body: CreatePlaceDto, imageBuffer: Buffer, filename: string) {
        const avatar = await this.photoServices.createPhoto(imageBuffer, filename);
        await this.repository.update(body, {
            photoId: avatar.id
        })
        return avatar
        // const queryRunner = this.connection.createQueryRunner();

        // await queryRunner.connect();
        // await queryRunner.startTransaction();

        // try {
        //     const place = await queryRunner.manager.findOne(Place, placeId);
        //     const photoId = place.photoId;
        //     const photo = await this.photoServices.createPhoto(imageBuffer, filename, queryRunner);

        //     await queryRunner.manager.update(Place, placeId, {
        //         id: photo.id
        //     });

        //     if (photoId) {
        //         await this.photoServices.deletePhoto(photoId, queryRunner);
        //     }

        //     await queryRunner.commitTransaction();

        //     return photo;
        // } catch {
        //     await queryRunner.rollbackTransaction();
        //     throw new InternalServerErrorException();
        // } finally {
        //     await queryRunner.release();
        // }
    }

    public async generatePlaces(places: Array<Place> = [], count: number = 5): Promise<Place[]> {
        try {
            let whereStr: string = ""
            if (places.length >= 1) {
                places.forEach(({ id }) => {
                    whereStr += `place.id != ${id}`
                    if (places[places.length - 1].id !== id) {
                        whereStr += " and "
                    }
                });
            }

            // select("place.id").from(Place, "place")
            const generatedPlaces = await this.repository.createQueryBuilder("place").where(whereStr).orderBy("RANDOM()").limit(count).getMany()
            return generatedPlaces
        } catch (error) {
            console.log(error);
        }
    }

    public async updatePlace(id: number, body: CreatePlaceDto): Promise<Place> {
        const findPlace: any = this.findPlaceById(id);
        findPlace.name = body.name;
        return await this.repository.save(findPlace);
    }

    public async removePlace(id: number): Promise<void> {
        const findPlace: any = this.findPlaceById(id);
        await this.repository.remove(findPlace);
    }
}
