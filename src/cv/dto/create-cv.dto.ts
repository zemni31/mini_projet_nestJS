import {
    ArrayUnique,
    IsArray,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateCvDto {
    @IsNotEmpty({ message: 'Le nom est obligatoire.' })
    @IsString({ message: 'Le nom doit être une chaîne de caractères.' })
    @MaxLength(50, { message: 'Le nom ne doit pas dépasser 50 caractères.' })
    name: string;

    @IsNotEmpty({ message: 'Le prénom est obligatoire.' })
    @IsString({ message: 'Le prénom doit être une chaîne de caractères.' })
    @MaxLength(50, { message: 'Le prénom ne doit pas dépasser 50 caractères.' })
    firstname: string;

    @IsInt({ message: "L'âge doit être un entier." })
    @Min(1, { message: "L'âge doit être supérieur ou égal à 1." })
    @Max(120, { message: "L'âge doit être inférieur ou égal à 120." })
    age: number;

    @IsNotEmpty({ message: 'Le CIN est obligatoire.' })
    @Matches(/^\d{8}$/, { message: 'Le CIN doit contenir exactement 8 chiffres.' })
    cin: string;

    @IsNotEmpty({ message: 'Le métier est obligatoire.' })
    @IsString({ message: 'Le métier doit être une chaîne de caractères.' })
    @MaxLength(100, { message: 'Le métier ne doit pas dépasser 100 caractères.' })
    job: string;

    @IsOptional()
    @IsString({ message: 'Le chemin doit être une chaîne de caractères.' })
    path?: string;

    @IsOptional()
    @IsArray({ message: 'skillIds doit être un tableau.' })
    @ArrayUnique({ message: 'skillIds ne doit pas contenir de doublons.' })
    @IsInt({ each: true, message: 'Chaque identifiant de compétence doit être un entier.' })
    skillIds?: number[];
}