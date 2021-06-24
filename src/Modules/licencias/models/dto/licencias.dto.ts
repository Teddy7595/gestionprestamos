import { from } from "rxjs";
import { IsNotEmpty, IsString, IsNumber, IsArray } from "class-validator";

export class creationLicenciaDto
{
    @IsNotEmpty()
    @IsString()
    admin: string

    @IsNotEmpty()
    @IsString()
    alias: string

    @IsNotEmpty()
    @IsNumber()
    precio: number

    @IsNotEmpty()
    @IsNumber()
    dias: number

    @IsString()
    observacion: string
}

export class modifyLicenciaDto 
{
    @IsString()
    alias: string

    @IsNumber()
    precio: number

    @IsNumber()
    dias: number

    @IsString()
    observacion: string

    @IsArray()
    updatedAt:string[]
}