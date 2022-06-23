import { Controller, Inject, Param, Post, Get, Query, UseGuards, ParseIntPipe } from "@nestjs/common";

import JwtAuthenticationGuard from "../auth/jwt.auth.guard";

import { Quest } from "./quest.entity";
import { IQuestQuery } from "./quest.interface";
import { QuestService } from "./quest.service";

@Controller("api/quest")
export class QuestController {
    @Inject(QuestService)
    private readonly questServices: QuestService

    // @UseGuards(JwtAuthenticationGuard)
    @Post("create/:userId")
    async createQuest(@Param("userId", ParseIntPipe) userId: number, @Query() query: IQuestQuery): Promise<Quest> {
        return await this.questServices.createQuest(userId, query)
    }

    @Get("find-all")
    async findAllQuests(): Promise<Quest[]> {
        return await this.questServices.findAllQuests()
    }
}