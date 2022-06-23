import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PlacesModule } from './places/places.module';
import { PhotoModule } from './photo/photo.module';
import { QuestModule } from './quest/quest.module';

@Module({
  imports: [PlacesModule, QuestModule, PhotoModule, UsersModule, AuthModule]
})
export class ApiModule { }
