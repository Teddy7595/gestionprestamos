import { IsNotEmpty, IsString, IsArray, Validate, Validator  } from "class-validator";


export class RutaDto 
{
    @IsNotEmpty()
    @IsString()
    enrutador_id:string;

    @IsNotEmpty()
    @IsString()
    ciudad:string;

    @IsNotEmpty()
    @IsString()
    departamento:string;

    updatedAt:Array<string>;
    
}