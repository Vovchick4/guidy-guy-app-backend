import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlaceDto {
    @IsString()
    @IsNotEmpty()
    public name: string;
}