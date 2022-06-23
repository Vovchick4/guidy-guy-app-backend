import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Place } from '../places/places.entity';

export class CreateQuestDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsString()
    @IsNotEmpty()
    uuid: string;

    @IsNumber()
    @IsNotEmpty()
    userId: number

    places: Place[]
}