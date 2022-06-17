import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import Role from '../auth/role.enum';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    role: Role;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}