import { Module } from '@nestjs/common';
import { PlacesModule } from './places/places.module';
import { PhotoModule } from './photo/photo.module';

@Module({
  imports: [PlacesModule, PhotoModule]
})
export class ApiModule { }
