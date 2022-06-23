import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Quest } from './quest.entity';
import { QuestService } from './quest.service';
import { QuestController } from './quest.controller';
import { Place } from '../places/places.entity';
import { PlacesService } from '../places/places.service';
import { Photo } from '../photo/photo.entity';
import { PhotoService } from '../photo/photo.service';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Quest]),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([Place]),
        TypeOrmModule.forFeature([Photo])
    ],
    controllers: [QuestController],
    providers: [QuestService, UsersService, PlacesService, PhotoService]
})
export class QuestModule { }
