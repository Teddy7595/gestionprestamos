import { IsNotEmpty, IsString, IsArray, IsNumber } from "class-validator";

export class UserDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  id_card: string;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @IsString()
  @IsNotEmpty()
  dir_domicilio: string;

  @IsString()
  @IsNotEmpty()
  nro_movil: string;

  @IsString()
  @IsNotEmpty()
  nro_fijo: string;

  @IsNumber()
  @IsNotEmpty()
  edad: number;

  // @IsString()
  // // @IsNotEmpty()
  // photo: string;


  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  pass: string;

  @IsString()
  // @IsNotEmpty()
  enrutator_id: string;



}

export class updateUserDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  id_card: string;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @IsString()
  @IsNotEmpty()
  dir_domicilio: string;

  @IsString()
  @IsNotEmpty()
  nro_movil: string;

  @IsString()
  @IsNotEmpty()
  nro_fijo: string;

  @IsNumber()
  @IsNotEmpty()
  edad: number;


}

export class updateProfileUserDTO
{

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string; 

  @IsString()
  @IsNotEmpty()
  id_card: string;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @IsString()
  @IsNotEmpty()
  dir_domicilio: string;

  @IsString()
  @IsNotEmpty()
  nro_movil: string;

  @IsString()
  @IsNotEmpty()
  nro_fijo: string;

  @IsNumber()
  @IsNotEmpty()
  edad: number;


  @IsNotEmpty()
  @IsArray()
  updatedAt: string[];


}