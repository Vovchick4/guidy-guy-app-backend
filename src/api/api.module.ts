import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PlacesModule } from './places/places.module';
import { PhotoModule } from './photo/photo.module';

@Module({
  imports: [PlacesModule, PhotoModule, UsersModule, AuthModule]
})
export class ApiModule { }
