import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Envs
// import { getEnvPath } from './common/helper/env.helper';

// TypeOrmService
import { ApiModule } from './api/api.module';
import * as ormconfig from '../ormconfig';

// Set env Files '
// const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        EMAIL_CONFIRMATION_URL: Joi.string().required(),
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
      }),
      envFilePath: "./src/common/envs/development.env",
      isGlobal: true
    }),
    TypeOrmModule.forRoot(ormconfig),
    ApiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
