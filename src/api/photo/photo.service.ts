import { Readable } from 'typeorm/platform/PlatformTools'
import { QueryRunner, Repository } from 'typeorm'
import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { join } from 'path'
import { createReadStream } from 'fs'

import { Photo } from './photo.entity'
import { CreatePhotoDto } from './photo.dto'

@Injectable()
export class PhotoService {
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>

    public findAllPhoto(): Promise<Photo[]> {
        return this.photoRepository.find({});
    }

    public async findPhotoByName(photoName: string, res: any) {
        const file = await this.photoRepository.findOne({ where: { filename: photoName } })
        if (!file)
            throw new NotFoundException();
        const stream = Readable.from(file.data);
        res.set({
            'Content-Disposition': `inline; filename="${file.filename}"`,
            'Content-Type': 'image'
        })
        return new StreamableFile(stream)
        // const stream = createReadStream(join(process.cwd(), file.filename))
        // res.set({
        //     'Content-Disposition': `inline; filename="${file.filename}"`,
        //     // 'Content-Type': file.mimetype
        // })
        // return new StreamableFile(stream)
    }

    public async createPhoto(dataBuffer: Buffer, filename: string): Promise<Photo> {
        const newFile = this.photoRepository.create({
            filename,
            data: dataBuffer
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
