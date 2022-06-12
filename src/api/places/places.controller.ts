import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Inject, Controller, Get, Post, Patch, Param, ParseIntPipe, Body, Delete, Query, UseInterceptors, Req, UploadedFile } from '@nestjs/common';

import { Place } from './places.entity';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './place.dto';
import { IPlaceParams } from './interfaces';

@Controller('api/places')
export class PlacesController {
    @Inject(PlacesService)
    private readonly services: PlacesService

    @Get('/:placeId')
    public async findPlaceById(@Param('placeId', ParseIntPipe) placeId: number): Promise<Place> {
        return await this.services.findPlaceById(placeId);
    }

    @Get()
    public async findPlace(@Query() query): Promise<object> {
        return await this.services.findPlace(query);
    }

    @Post()
    public async createPlace(@Body() body: CreatePlaceDto): Promise<Place> {
        return await this.services.createPlace(body);
    }

    @Post('photos')
    @UseInterceptors(FileInterceptor("file"))
    public async uploadPhoto(@Body() body, @UploadedFile() file: Express.Multer.File) {
        return await this.services.uploadPhoto(body, file.buffer, file.originalname);
    }

    @Patch('/:placeId')
    public async updatePlace(@Param('placeId', ParseIntPipe) placeId: number, @Body() body: CreatePlaceDto): Promise<Place> {
        return await this.services.updatePlace(placeId, body);
    }

    @Delete('/:placeId')
    public async removePlace(@Param('placeId', ParseIntPipe) placeId: number): Promise<void> {
        return await this.services.removePlace(placeId);
    }
}
