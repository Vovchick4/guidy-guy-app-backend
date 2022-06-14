import { QueryRunner, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Photo } from './photo.entity';
import { CreatePhotoDto } from './photo.dto';

@Injectable()
export class PhotoService {
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>

    public findAllPhoto(): Promise<Photo[]> {
        return this.photoRepository.find({});
    }

    public async createPhoto(dataBuffer: Buffer, filename: string): Promise<Photo> {
        const newFile = this.photoRepository.create({
            filename,
            // data: dataBuffer
        })
        return await this.photoRepository.save(newFile);
    }

    public async deletePhoto(fileId: number, queryRunner: QueryRunner) {
        const deleteResponse = await queryRunner.manager.delete(Photo, fileId);
        if (!deleteResponse.affected) {
            throw new NotFoundException();
        }
    }
}
