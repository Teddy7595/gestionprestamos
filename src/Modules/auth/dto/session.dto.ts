import { IsNotEmpty, IsString, IsObject, IsEmail, IsEmpty, IsNumber, IsArray } from 'class-validator';

export class sessionDTO {


    @IsNotEmpty()
    @IsString()
    _id: string;

    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsString()
    last_name: string;
    @IsNotEmpty()
    @IsString()
    id_card: string;
    @IsNotEmpty()
    @IsString()
    pais: string;
    @IsNotEmpty()
    @IsString()
    estado: string;
    @IsNotEmpty()
    @IsString()
    ciudad: string;
    @IsNotEmpty()
    @IsString()
    dir_domicilio: string;
    @IsNotEmpty()
    @IsString()
    nro_movil: string;
    @IsNotEmpty()
    @IsString()
    nro_fijo: string;
    @IsNotEmpty()
    @IsNumber()
    edad: string;
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsEmpty()
    // @IsString()
    enrutator_id: string;

    @IsNotEmpty()
    @IsString({
      // message: "$property debe ser un string"
    })
    rol: string;
    @IsNotEmpty()
    @IsString({
      // message: "$property debe ser un string"
    })
    rolName: string;


    @IsNotEmpty()
    @IsString({
      // message: "$property debe ser un string"
    })
    token: string;

    // @IsNotEmpty()
    // @IsObject()
    // userMenu: any;

    @IsNotEmpty()
    @IsArray()
    updatedAt: string[];

    @IsNotEmpty()
    @IsArray()
    createdAt: string[];

    @IsNotEmpty()
    @IsArray()
    last_session: string[];



}
