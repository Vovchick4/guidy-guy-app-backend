import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Place } from './places.entity';
import { CreatePlaceDto } from './place.dto';

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

    public async findPlace(params: object): Promise<Place[]> {
        const findPlace = await this.repository.find({})
        if (!findPlace) {
            throw new HttpException('Not Found Place', HttpStatus.NOT_FOUND)
        }

        return findPlace;
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
