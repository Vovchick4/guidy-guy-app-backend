import { Controller, Inject, Param, Post, Get, Query, ParseIntPipe } from "@nestjs/common";

import { UsersService } from "./users.service";
import { User } from "./users.entity";

@Controller("api/user")
export class UserController {
    @Inject(UsersService)
    private readonly userServices: UsersService

    @Get("/:userId")
    async findUserById(@Param("userId", ParseIntPipe) userId: number): Promise<User> {
        return await this.userServices.findOneById(userId)
    }

    @Get("/find/find-all")
    async findAllUser(): Promise<User[]> {
        return await this.userServices.findAll()
    }
}