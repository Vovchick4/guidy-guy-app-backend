import { Module } from '@nestjs/common';
import EmailService from './email.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfirmationController } from './emailConfirmation.controller';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { User } from '../users/users.entity';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([User]), UsersModule],
    controllers: [EmailConfirmationController],
    providers: [EmailService, UsersService, AuthService, JwtService]
})
export class EmailModule { }