import { Point } from 'geojson';
import { IsBoolean, IsNotEmpty, IsString, isNumber, isArray } from 'class-validator';

export class CreatePlaceDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsBoolean()
    public like: boolean;

    public fileName: string;
    public coordinates: any;
}