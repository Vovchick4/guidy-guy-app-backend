import { Inject, Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { Place } from './places.entity';
import { CreatePlaceDto } from './place.dto';
import createFilter from './filter';
import { IPlaceParams, IPlaceCreateParams } from './interfaces'
import { PhotoService } from '../photo/photo.service';

@Injectable()
export class PlacesService {
    @InjectRepository(Place)
    private readonly repository: Repository<Place>
    @Inject(PhotoService)
    private readonly photoServices: PhotoService

    public async findPlaceById(uuid: string): Promise<Place> {
        const findElem = await this.repository.findOne({ where: { uuid } });

        if (!findElem) {
            throw new HttpException('Not Found Place', HttpStatus.NOT_FOUND)
        }

        return findElem;
    }

    public async findPlace(query: IPlaceParams): Promise<object> {
        const filter = createFilter(query)
        const take = query?.take || 8
        const skip = query?.skip || 0

        const [result, total] = await this.repository.findAndCount({ where: filter, take, skip: skip * take, order: { id: "ASC" } })
        if (!result) {
            throw new HttpException('Not Found Place', HttpStatus.NOT_FOUND)
        }

        return {
            data: result,
            total
        };
    }

    public async createPlace(body: IPlaceCreateParams): Promise<Place> {
        const { name, like, coordinates, file } = body

        const place: Place = new Place();
        place.name = name;
        place.like = like ? like : false;
        place.coordinates = coordinates;

        // if (file) {
        //     this.uploadPhoto(body)
        // }

        return await this.repository.save(place);
    }

    public async uploadPhoto(body: CreatePlaceDto, imageBuffer: Buffer, filename: string) {
        const avatar = await this.photoServices.createPhoto(imageBuffer, filename);
        await this.repository.update(body, {
            fileName: filename,
            photoId: avatar.id,
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

    public async updatePlace(uuid: string, body: IPlaceCreateParams): Promise<Place> {
        const { name, like, coordinates, file } = body
        const findPlace: Place = await this.findPlaceById(uuid)
        await this.repository.update({ uuid }, { name, like, coordinates })
        return findPlace
    }

    public async removePlace(uuid: string): Promise<void> {
        // const findPlace: any = this.findPlaceById(uuid);
        // if (!findPlace)
        //     throw new NotFoundException("")
        await this.repository.delete({ uuid });
    }
}
