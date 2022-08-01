import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Quest } from './quest.entity';
import { PlacesService } from '../places/places.service';
import { UsersService } from '../users/users.service';
import { IQuestQuery } from "./quest.interface"
import { User } from '../users/users.entity';
import { Point } from 'geojson';
import { Place } from '../places/places.entity';

@Injectable()
export class QuestService {
    @InjectRepository(Quest)
    private readonly questRepo: Repository<Quest>
    @Inject(PlacesService)
    private readonly placeService: PlacesService
    @Inject(UsersService)
    private readonly usersService: UsersService

    async createQuest(userId: number, body: IQuestQuery): Promise<Quest> {
        // Check Is User Exist
        await this.usersService.findOneById(userId)
        if (!body.name) {
            throw new HttpException("You must provice name QUEST", HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const userQuests = await this.findAllQuestsByUserId(userId);
        let skipPlaceForQuest = []

        if (userQuests) {
            userQuests.forEach(element => {
                skipPlaceForQuest.push(element.places)
            });
            skipPlaceForQuest = skipPlaceForQuest.flatMap(elem => elem)
        }

        const generetedPalces = await this.placeService.generatePlaces(skipPlaceForQuest, body.count)
        const create = this.questRepo.create({ name: body.name, userId, places: generetedPalces })
        return await this.questRepo.save(create)
    }

    async checkQuestPlace(placeId: string, user: User, userCoords: Point, questUUID: string) {
        const findIsPlaceQuest = await this.findOneQuestById(user.id, questUUID)
        if (!findIsPlaceQuest) {
            throw new HttpException("Not Found Quest with this user id and questId", HttpStatus.NOT_FOUND);
        } else if (!findIsPlaceQuest.places.find(({ uuid }) => uuid === placeId)) {
            throw new HttpException("Not Found Place in this Quest", HttpStatus.NOT_FOUND);
        }

        const findPlace = await this.placeService.findPlaceById(placeId)
        const { coordinates: { coordinates: placeCoords } } = findPlace
        const { coordinates } = userCoords
        const userRadius = 0.003
        if ((coordinates[0] <= placeCoords[0] - userRadius && coordinates[0] >= placeCoords[0] + userRadius)
            && (coordinates[1] <= placeCoords[1] - userRadius && coordinates[1] >= placeCoords[1] + userRadius)) {
            throw new HttpException("Complete!", HttpStatus.FOUND);
        } else {
            throw new HttpException("Your location not near to this place", HttpStatus.NOT_FOUND);
        }
    }

    async findAllQuests(): Promise<Quest[]> {
        // Find All User Quests
        const result = await this.questRepo.find({})
        // if (!result) {
        //     throw new HttpException('Not Found Quest', HttpStatus.NOT_FOUND)
        // }
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

    async findAllQuestsByUserId(userId: number): Promise<Quest[]> {
        // Find All User Quests
        const result = await this.questRepo.find({ where: { userId } })

        // if (!result || result.length === 0) {
        //     throw new HttpException(`Not Found Quest with id ${userId}`, HttpStatus.NOT_FOUND)
        // }
        return result
    }
}