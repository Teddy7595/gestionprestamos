import { IsNotEmpty, IsString, IsArray, IsNumber } from "class-validator";

export class BitacoraDto 
{
  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  usuario: string;

  @IsNotEmpty()
  @IsString()
  admin: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;
}