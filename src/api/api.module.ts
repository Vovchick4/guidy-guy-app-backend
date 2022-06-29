import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PlacesModule } from './places/places.module';
import { PhotoModule } from './photo/photo.module';
import { QuestModule } from './quest/quest.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [PlacesModule, QuestModule, PhotoModule, UsersModule, AuthModule, EmailModule]
})
export class ApiModule { }
