import { IsNotEmpty, IsString } from "class-validator"


export class modifyUserLicenciaDto
{
	@IsNotEmpty()
    @IsString()
    _id:string

    @IsNotEmpty()
    @IsString()
    dias:number
    
    @IsNotEmpty()
    @IsString()
    status:string
}
