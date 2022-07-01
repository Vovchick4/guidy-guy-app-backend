import FastifyReply from 'fastify-reply-from'
import { Body, Req, Res, Controller, HttpCode, Get, Post, UseGuards, Inject } from '@nestjs/common';

import { EmailConfirmationService } from '../email/emailConfirmation.service';
import { LocalAuthnGuard } from './local.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/users.dto';
import { RequestWithUser } from './interfaces';
import JwtAuthenticationGuard from './jwt.auth.guard';
import RoleGuard from './role.guard';
import Role from './role.enum';
import { EmailConfirmationGuard } from '../email/emailConfirmation.guard';
import { UsersService } from '../users/users.service';
import JwtRefreshGuard from './jwtRefresh.guard';

@Controller('api/auth')
export class AuthController {
    @Inject(AuthService)
    private readonly authService: AuthService
    @Inject(UsersService)
    private readonly userSevice: UsersService
    // @Inject(EmailConfirmationService)
    // private readonly emailConfirmationService: EmailConfirmationService

    @Post('sign-up')
    async signUp(@Body() data: CreateUserDto, @Res() response: FastifyReply) {
        const createdUser: any = await this.authService.register(data);
        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(createdUser.id);
        const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(createdUser.id);
        await this.userSevice.setCurrentRefreshToken(refreshTokenCookie.token, createdUser.id);
        response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie.cookie]);
        createdUser.password = undefined;
        // await this.emailConfirmationService.sendVerificationLink(createdUser.email);
        return response.send(createdUser);
    }

    @HttpCode(200)
    // @UseGuards(EmailConfirmationGuard)
    @UseGuards(JwtAuthenticationGuard)
    @UseGuards(RoleGuard(Role.admin))
    @Post('sign-up-admin')
    async signUpAdmin(@Body() data: CreateUserDto, @Res() response: FastifyReply) {
        const newDataWithAdminRole = { ...data, role: Role.admin }
        const createdUser: any = await this.authService.register(newDataWithAdminRole);
        createdUser.password = undefined;
        // await this.emailConfirmationService.sendVerificationLink(createdUser.email);
        return response.send(createdUser);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthnGuard)
    @Post('log-in')
    async logIn(@Req() request: RequestWithUser, @Res() response: FastifyReply) {
        const { user } = request;

        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id);
        const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(user.id);

        await this.userSevice.setCurrentRefreshToken(refreshTokenCookie.token, user.id);

        response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie.cookie]);

        user.password = undefined;
        return response.send(user);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('log-out')
    async logOut(@Req() request: RequestWithUser, @Res() response: FastifyReply) {
        const { user } = request;
        await this.userSevice.removeRefreshToken(user.id);
        response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
        return response.send({ text: "YouLogOut" })
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@Req() request: RequestWithUser, @Res() response: FastifyReply) {
        const { user } = request;
        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id);

        response.setHeader('Set-Cookie', accessTokenCookie);
        return response.send(user);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get('get-user')
    getUser(@Req() request: RequestWithUser) {
        const user = request.user;
        user.password = undefined;
        return user;
    }
}