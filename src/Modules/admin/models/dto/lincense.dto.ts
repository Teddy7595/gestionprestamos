import { IsNotEmpty, IsString, IsArray, IsNumber } from "class-validator";

export class LicenseDto 
{
  @IsNotEmpty()
  @IsString()
  nombre: string;
  @IsNotEmpty()
  @IsString()
  duracion: string;
  @IsNotEmpty()
  @IsString()
  usuario: string;
  @IsNotEmpty()
  @IsString()
  admin: string;
  @IsNotEmpty()
  @IsNumber() 
  precio: number;
  @IsNotEmpty()
  @IsNumber()
  dayReaming: number;
  @IsNotEmpty()
  @IsString()
  status: string;
}

export class LicenseChangeStatusDto 
{
  @IsNotEmpty()
  @IsString()
  status: string;

  @IsArray()
  updatedAt: string[];
}