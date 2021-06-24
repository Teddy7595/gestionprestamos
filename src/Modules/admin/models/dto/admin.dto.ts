import { IsNotEmpty, IsString, IsArray } from "class-validator";

export class RoleUserDto
{

  @IsNotEmpty()
  @IsString()
  rol: string;

  @IsNotEmpty()
  @IsString()
  enrouter?: string;

  @IsNotEmpty()
  @IsString()
  type?: string;

}

export class responseChangeRoleDTO
{

  @IsNotEmpty()
  @IsString()
  rol: string;

  @IsNotEmpty()
  @IsArray()
  updatedAt: string[];

  @IsNotEmpty()
  @IsString()
  enrutator_id?: string;

}