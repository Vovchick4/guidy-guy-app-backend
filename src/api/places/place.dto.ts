import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePlaceDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsBoolean()
    public like: boolean;
}