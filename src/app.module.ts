import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Envs
import { getEnvPath } from './common/helper/env.helper';

// TypeOrmService
import { ApiModule } from './api/api.module';
import * as ormconfig from './ormconfig';

// Set env Files '
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    ApiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
