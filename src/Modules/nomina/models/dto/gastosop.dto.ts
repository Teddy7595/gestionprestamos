import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class RetrieveGastosOpDTO
{

	@IsString()
	_id:string

	@IsString()
	_cajachica:string

	@IsNumber()
	index:number
}

export class CreateGastosOpDTO
{
	@IsString()
	@IsNotEmpty()
	_cajachica:string

	@IsNumber()
	@IsNotEmpty()
	monto:number

	@IsString()
	@IsNotEmpty()
	desc:string
}

export class ModifyGastosOpDTO
{
	@IsString()
	@IsNotEmpty()
	_cajachica:string

	@IsNumber()
	@IsNotEmpty()
	monto:number

	@IsString()
	@IsNotEmpty()
	desc:string

	@IsNumber()
	@IsNotEmpty()
	index:number
}

export class DeleteGastosOpDTO
{
	@IsString()
	@IsNotEmpty()
	_cajachica:string

	@IsNumber()
	@IsNotEmpty()
	index:number
}