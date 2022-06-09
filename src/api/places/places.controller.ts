import { Inject, Controller, Get, Post, Param, ParseIntPipe, Body } from '@nestjs/common';

import { Place } from './places.entity';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './place.dto';

@Controller('places')
export class PlacesController {
    @Inject(PlacesService)
    private readonly services: PlacesService;

    @Get(':id')
    public getPlaceById(@Param('id', ParseIntPipe) id: number): Promise<Place> {
        return this.services.getPlaceById(id);
    }

    @Post()
    public createPlace(@Body() body: CreatePlaceDto): Promise<Place> {
        return this.services.createPlace(body);
    }
}
