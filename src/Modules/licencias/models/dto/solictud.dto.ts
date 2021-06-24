import { IsNotEmpty, IsString, IsNumber } from "class-validator"

export class solicitudLicenciaDto
{
    @IsNotEmpty()
    @IsString()
    idUsuario:string
}

export class setLicenciaUserDto
{
    @IsNotEmpty()
    @IsString()
    usuario:string

    @IsNotEmpty()
    @IsString()
    licencia:string
 
    @IsNotEmpty()
    @IsString()
    dias:number

    @IsString()
    status:string
}
