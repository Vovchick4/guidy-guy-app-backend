import { Controller, Inject, Post, Get, Body, Param, ParseIntPipe, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';

import { Photo } from './photo.entity';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './photo.dto';

@Controller('api/photo')
@UseInterceptors(ClassSerializerInterceptor)
export class PhotoController {
    @Inject(PhotoService)
    private readonly services: PhotoService

    @Get()
    public findAllPhoto(): Promise<Photo[]> {
        return this.services.findAllPhoto();
    }

    // @Post('/:placeId')
    // public async createPhoto(@Param('placeId', ParseIntPipe) placeId: number, @Body() body: CreatePhotoDto): Promise<Photo> {
    //     return await this.services.createPhoto(placeId, body);
    // }
}
