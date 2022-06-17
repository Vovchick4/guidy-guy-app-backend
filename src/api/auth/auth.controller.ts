import FastifyReply from 'fastify-reply-from'
import { Body, Req, Res, Controller, HttpCode, Get, Post, UseGuards, Inject } from '@nestjs/common';

import { LocalAuthnGuard } from './local.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/users.dto';
import { RequestWithUser } from './interfaces';
import JwtAuthenticationGuard from './jwt.auth.guard';
import RoleGuard from './role.guard';
import Role from './role.enum';

@Controller('api/auth')
export class AuthController {
    @Inject(AuthService)
    private readonly authService: AuthService

    @Post('sign-up')
    async signUp(@Body() data: CreateUserDto, @Res() response: FastifyReply) {
        const createdUser: any = await this.authService.register(data);
        const cookie = this.authService.getCookieWithJwtToken(createdUser.id);
        response.setHeader('Set-Cookie', cookie);
        createdUser.password = undefined;
        return response.send(createdUser);
    }

    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @UseGuards(RoleGuard(Role.admin))
    @Post('sign-up-admin')
    async signUpAdmin(@Body() data: CreateUserDto, @Res() response: FastifyReply) {
        const newDataWithAdminRole = { ...data, role: Role.admin }
        const createdUser: any = await this.authService.register(newDataWithAdminRole);
        createdUser.password = undefined;
        return response.send(createdUser);
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