import FastifyReply from 'fastify-reply-from'
import { Body, Req, Res, Controller, HttpCode, Get, Post, UseGuards, Inject } from '@nestjs/common';

import { LocalAuthnGuard } from './local.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/users.dto';
import { RequestWithUser } from './interfaces';
import JwtAuthenticationGuard from './jwt.auth.guard';

@Controller('api/auth')
export class AuthController {
    @Inject(AuthService)
    private readonly authService: AuthService

    @Post('sign-up')
    async signUp(@Body() data: CreateUserDto) {
        return this.authService.register(data);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthnGuard)
    @Post('log-in')
    async logIn(@Req() request: RequestWithUser, @Res() response: FastifyReply) {
        const { user } = request;
        const cookie = this.authService.getCookieWithJwtToken(user.id);
        response.setHeader('Set-Cookie', cookie);
        user.password = undefined;
        return response.send(user);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('log-out')
    async logOut(@Req() request: RequestWithUser, @Res() response: FastifyReply) {
        response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
        return response.sendStatus(200);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get('get-user')
    getUser(@Req() request: RequestWithUser) {
        const user = request.user;
        user.password = undefined;
        return user;
    }
}