import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt'
import { Inject, Injectable, HttpException, HttpStatus } from "@nestjs/common";

import { CreateUserDto } from "../users/users.dto";
import { UsersService } from "../users/users.service";
import { User } from '../users/users.entity';
import { TokenPayload } from './interfaces';

@Injectable()
export class AuthService {
    @Inject(UsersService)
    private readonly usersService: UsersService
    private readonly jwtService: JwtService
    private readonly configService: ConfigService

    public async register(data: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        try {
            const createdUser = await this.usersService.create({
                ...data,
                password: hashedPassword
            });
            createdUser.password = undefined;
            return createdUser;
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async logIn(email: string, password: string) {
        try {
            const user = await this.usersService.findOne(email);
            await this.verifyPassword(password, user.password);
            user.password = undefined;
            return user;
        } catch (error) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    private async verifyPassword(password: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
            password,
            hashedPassword
        );
        if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    public getCookieWithJwtToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }
}