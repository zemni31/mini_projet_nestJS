import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSkillDto {
    @IsNotEmpty({ message: 'La désignation est obligatoire.' })
    @IsString({ message: 'La désignation doit être une chaîne de caractères.' })
    @MinLength(2, { message: 'La désignation doit contenir au moins 2 caractères.' })
    @MaxLength(50, { message: 'La désignation ne doit pas dépasser 50 caractères.' })
    designation: string;
}