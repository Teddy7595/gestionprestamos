import { IsNotEmpty, IsString, IsEmail, IsPhoneNumber, IsNumber, IsEmpty } from 'class-validator';

export class SignupDto {


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
  @IsNotEmpty()
  @IsString()
  pass: string;
  @IsEmpty()
  // @IsString()
  enrutator_id?: string;


}
