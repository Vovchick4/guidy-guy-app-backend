import FastifyReply from 'fastify-reply-from'
import { Controller, Inject, Post, Get, Body, Param, ParseIntPipe, ClassSerializerInterceptor, UseInterceptors, ParseUUIDPipe, Res } from '@nestjs/common';

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

    @Get("/:photoName")
    public findPhotoByName(@Param("photoName") photoName: string, @Res({ passthrough: true }) res: FastifyReply) {
        return this.services.findPhotoByName(photoName, res);
    }

    // @Post('/:placeId')
    // public async createPhoto(@Param('placeId', ParseUUIDPipe) placeId: string, @Body() body: CreatePhotoDto): Promise<Photo> {
    //     return await this.services.createPhoto(placeId, body);
    // }
}
