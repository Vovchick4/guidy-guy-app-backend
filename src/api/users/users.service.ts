import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'

import { User } from './users.entity';
import { CreateUserDto } from './users.dto';

@Injectable()
export class UsersService {
    @InjectRepository(User)
    private readonly userRepo: Repository<User>

    async findAll(): Promise<User[]> {
        const findUser = await this.userRepo.find({})
        if (findUser) {
            return findUser
        }
        throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }

    async findOneById(id: number): Promise<User> {
        const findUser = await this.userRepo.findOne({ where: { id } })
        if (findUser) {
            return findUser
        }
        throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }

    async findOne(email: string): Promise<User> {
        const findUser = await this.userRepo.findOne({ where: { email } })
        if (findUser) {
            return findUser
        }
        throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }

    async markEmailAsConfirmed(email: string) {
        return await this.userRepo.update({ email }, {
            verify_at: new Date().toLocaleDateString()
        });
    }

    async create(data: any) {
        const newUser = this.userRepo.create(data);
        await this.userRepo.save(newUser);
        return newUser;
    }

    async removeRefreshToken(userId: number) {
        return await this.userRepo.update(userId, {
            currentHashedRefreshToken: null
        });
    }

    async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepo.update(userId, {
            currentHashedRefreshToken
        });
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
        const user = await this.findOneById(userId);

        const isRefreshTokenMatching = await bcrypt.compare(
            refreshToken,
            user.currentHashedRefreshToken
        );

        if (isRefreshTokenMatching) {
            return user;
        }
    }
}