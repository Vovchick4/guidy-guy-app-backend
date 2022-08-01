import { Controller, Inject, Param, Post, Get, Query, UseGuards, ParseIntPipe, Body } from "@nestjs/common";

import JwtAuthenticationGuard from "../auth/jwt.auth.guard";

import { Quest } from "./quest.entity";
import { IQuestQuery } from "./quest.interface";
import { QuestService } from "./quest.service";

@Controller("api/quest")
export class QuestController {
    @Inject(QuestService)
    private readonly questServices: QuestService

    @UseGuards(JwtAuthenticationGuard)
    @Post("create/:userId")
    async createQuest(@Param("userId", ParseIntPipe) userId: number, @Body() body: IQuestQuery): Promise<Quest> {
        return await this.questServices.createQuest(userId, body)
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get("/:userId")
    async findAllQuestsByUserId(@Param("userId", ParseIntPipe) userId: number): Promise<Quest[]> {
        return await this.questServices.findAllQuestsByUserId(userId)
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get("/:userId/:questId")
    async findOneQuestById(@Param("userId", ParseIntPipe) userId: number, @Param("questId", ParseIntPipe) questId: string): Promise<Quest> {
        return await this.questServices.findOneQuestById(userId, questId)
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get("find-all")
    async findAllQuests(): Promise<Quest[]> {
        return await this.questServices.findAllQuests()
    }
}