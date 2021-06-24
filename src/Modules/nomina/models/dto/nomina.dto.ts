import {IsString, IsNumber, IsNotEmpty, IsBoolean} from "class-validator"

export class CreateNominaDTO 
{
	@IsString()
	@IsNotEmpty()
	enrutador:string
	
	@IsString()
	@IsNotEmpty()
	cobrador:string
	
	@IsString()
	@IsNotEmpty()
	banco_nombre:string
	
	@IsString()
	@IsNotEmpty()
	banco_cuenta:string
	
	@IsNumber()
	@IsNotEmpty()
	salario:number
	
	@IsString()
	@IsNotEmpty()
	observacion:string

	@IsNumber()
	@IsNotEmpty()
	concurrencia:number
}

export class ModifyNominaDTO
{
	@IsString()
	@IsNotEmpty()
	_id:string

	@IsString()
	@IsNotEmpty()
	banco_nombre:string
	
	@IsString()
	@IsNotEmpty()
	banco_cuenta:string
	
	@IsNumber()
	@IsNotEmpty()
	salario:number
	
	@IsString()
	@IsNotEmpty()
	observacion:string
	
	@IsBoolean()
	@IsNotEmpty()
	activo:boolean

	@IsNumber()
	@IsNotEmpty()
	concurrencia:number
}

export class GetSalarioNominaDTO
{
	@IsString()
	@IsNotEmpty()
	cajachica_id:string

	@IsString()
	@IsNotEmpty()
	nomina_id:string

	@IsString()
	cobrador_id:string

	@IsString()
	enrutador_id:string
}