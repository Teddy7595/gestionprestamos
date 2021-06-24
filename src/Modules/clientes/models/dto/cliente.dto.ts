import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class ClienteDto
{
    @IsNotEmpty()
    @IsString()
    card_id:string


    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    last_name:string

    @IsNotEmpty()
    @IsNumber()
    edad:number

    @IsNotEmpty()
    @IsNumber()
    phone:string[]

    @IsNotEmpty()
    @IsString()
    mail:string

    @IsNotEmpty()
    @IsString()
    photo:string

    @IsNotEmpty()
    @IsString()
    geo:string

    @IsNotEmpty()
    @IsString()
    semaforo:string


    @IsNotEmpty()
    @IsString()
    enrutador_id: string

    // @IsNotEmpty()
    @IsString()
    ruta_id?: string

}