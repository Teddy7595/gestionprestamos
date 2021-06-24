import { IsNotEmpty, IsString, IsNumber } from "class-validator"

export class responseLicenciaDto
{   
    @IsString()
    @IsNotEmpty()
    idPeticion:string

    @IsString()
    @IsNotEmpty()
    idUsuario:string

    @IsString()
    @IsNotEmpty()
    status:string

    @IsString()
    @IsNotEmpty()
    createdAt:string
}