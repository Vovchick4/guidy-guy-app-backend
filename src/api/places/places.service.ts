import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Place } from './places.entity';
import { CreatePlaceDto } from './place.dto';
import createFilter from './filter';
import { IPlaceParams } from './interfaces'

@Injectable()
export class PlacesService {
    @InjectRepository(Place)
    private readonly repository: Repository<Place>

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
        return await this.repository.save(place);
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