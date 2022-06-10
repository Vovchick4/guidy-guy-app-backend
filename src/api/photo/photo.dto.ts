import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePhotoDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsString()
    @IsNotEmpty()
    filename: string
}