import { IsString, IsNotEmpty } from "class-validator"

export class BitacoraDto
{
    @IsString()
    @IsNotEmpty()
    actor:string;

    @IsString()
    @IsNotEmpty()
    event:string;

    @IsString()
    @IsNotEmpty()
    action:string; 

    @IsString()
    type:string;
}

export class GetReportDto
{
    @IsString()
    @IsNotEmpty()
    actor:string;

    @IsString()
    type:string;

    @IsString()
    _id:string;
}