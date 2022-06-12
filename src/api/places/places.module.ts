import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Place } from './places.entity';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { PhotoService } from '../photo/photo.service';
import { Photo } from '../photo/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place]), TypeOrmModule.forFeature([Photo])],
  controllers: [PlacesController],
  providers: [PlacesService, PhotoService]
})
export class PlacesModule { }
