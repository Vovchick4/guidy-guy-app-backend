import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

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
}