import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateCajaChicaDTO
{

	@IsString()
	@IsNotEmpty()	
	cobrador:string

	@IsString()
	@IsNotEmpty()
	enrutador:string

	@IsNumber()
	@IsNotEmpty()
	monto:number
}

export class ModifyCajaChicaDTO
{
	@IsString()
	@IsNotEmpty()
	_id:string

	@IsNumber()
	@IsNotEmpty()
	monto:number
}