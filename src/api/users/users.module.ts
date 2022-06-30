import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from './users.entity';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { EmailConfirmationService } from '../email/emailConfirmation.service';
import EmailService from '../email/email.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    exports: [UsersService],
    controllers: [UserController],
    providers: [UsersService, EmailService, EmailConfirmationService, JwtService]
})
export class UsersModule { }