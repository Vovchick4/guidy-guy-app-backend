import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Quest } from './quest.entity';
import { PlacesService } from '../places/places.service';
import { UsersService } from '../users/users.service';
import { IQuestQuery } from "./quest.interface"

@Injectable()
export class QuestService {
    @InjectRepository(Quest)
    private readonly questRepo: Repository<Quest>
    @Inject(PlacesService)
    private readonly placeService: PlacesService
    @Inject(UsersService)
    private readonly usersService: UsersService

    async createQuest(userId: number, query: IQuestQuery): Promise<Quest> {
        // Check Is User Exist
        await this.usersService.findOneById(userId)
        if (!query.name) {
            throw new HttpException("You must provice name QUEST", HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const userQuests = await this.findAllQuestByUserId(userId);
        let skipPlaceForQuest = []

        if (userQuests) {
            userQuests.forEach(element => {
                skipPlaceForQuest.push(element.places)
            });
            skipPlaceForQuest = skipPlaceForQuest.flatMap(elem => elem)
        }

        const generetedPalces = await this.placeService.generatePlaces(skipPlaceForQuest, query.count)
        const create = this.questRepo.create({ name: query.name, userId, places: generetedPalces })
        return await this.questRepo.save(create)
    }

    async findAllQuests(): Promise<Quest[]> {
        // Find All User Quests
        const result = await this.questRepo.find({})
        if (!result) {
            throw new HttpException('Not Found Quest', HttpStatus.NOT_FOUND)
        }
        return result
    }

    async findOneQuestById(userId: number, questId: string): Promise<Quest> {
        // Find All User Quests
        const result = await this.questRepo.findOne({ where: { userId, uuid: questId } })
        if (!result) {
            throw new HttpException('Not Found Quest', HttpStatus.NOT_FOUND)
        }
        return result
    }

    async findAllQuestByUserId(userId: number): Promise<Quest[]> {
        // Find All User Quests
        const result = await this.questRepo.find({ where: { userId } })
        if (!result) {
            throw new HttpException(`Not Found Quest with id ${userId}`, HttpStatus.NOT_FOUND)
        }
        return result
    }
}