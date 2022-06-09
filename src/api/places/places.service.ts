import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Place } from './places.entity';
import { CreatePlaceDto } from './place.dto';

@Injectable()
export class PlacesService {
    @InjectRepository(Place)
    private readonly repository: Repository<Place>

    public async getPlaceById(id: number): Promise<Place> {
        const findElem = await this.repository.findOne({ where: { id } });

        if (!findElem) {
            throw new HttpException('Not Found Place', HttpStatus.NOT_FOUND)
        }

        return findElem;
    }

    public createPlace(body: CreatePlaceDto): Promise<Place> {
        const place: Place = new Place();
        place.name = body.name;
        return this.repository.save(place);
    }
}
