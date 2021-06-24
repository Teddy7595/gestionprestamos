import { IsNotEmpty, IsString, IsArray, validate } from "class-validator";


export class RolesDto {

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  alias: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  // @IsNotEmpty()
  // @IsArray()
  // updatedAt?: any;

}

export class responseRolesDto {

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  alias: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsArray()
  updatedAt?: any;

}
