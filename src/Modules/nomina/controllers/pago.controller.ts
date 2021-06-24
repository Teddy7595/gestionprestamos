import
{
	Controller,
	Response,
	Param,
	Body,
	Get,
	Post,
	Put,
	Delete,
	UseGuards
} from '@nestjs/common';

import
{
	responseInterface
}from '../../../Response/interfaces/interfaces.index';

import { PagoService } from '../services/pago.service';

import
{
	GetSalarioNominaDTO
} from '../models/dto/index.dto';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";


@Controller('nomina/pago')
export class PagoController
{
	private _Response:responseInterface;

	constructor
	(
		private _pagoService:PagoService
	){}

	@Get('hello')
	async sayHello(@Response() res:any):Promise<responseInterface>
	{
		return res.status(200).json("controlador encargado del servicio de pagos a nomina");
	}

	@RolesDecorator('ENRUTATOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Get('calculo/cobrador') //ruta que calcular el salario por cobrador
	async getCalculoSalarioByCobrador(@Response() res:any, @Body() ids:GetSalarioNominaDTO):Promise<responseInterface>
	{
		this._Response = await this._pagoService.getCalculoSalarioByCobrador(ids);
		return res.status(this._Response.status).json(this._Response);
	}

	@RolesDecorator('ENRUTATOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Get('calculo/enrutador') //ruta que calcular el salario por cobrador
	async getCalculoSalarioByEnrutador(@Response() res:any, @Body() ids:GetSalarioNominaDTO):Promise<responseInterface>
	{
		this._Response = await this._pagoService.getCalculoSalarioByEnrutador(ids);
		return res.status(this._Response.status).json(this._Response);
	}

}
