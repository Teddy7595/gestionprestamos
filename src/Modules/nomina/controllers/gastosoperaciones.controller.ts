import
{
	Controller,
	Response,
	Body,
	Param,
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

import { GastosoperacionesService } from '../services/gastosoperaciones.service';

import
{
	CreateGastosOpDTO,
	ModifyGastosOpDTO,
	RetrieveGastosOpDTO,
	DeleteGastosOpDTO
} from '../models/dto/index.dto';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";

@Controller('cajachica/gastos')
export class GastosoperacionesController
{
	private _Response:responseInterface;

	constructor
	(
		private _gastosOperacion:GastosoperacionesService
	){}

	@Get('hello')
	async hello(@Response() res:any):Promise<responseInterface>
	{
		return res.status(200).json('Ruta para controlde gastos de operaciones');
	}

	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'COLLECTOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Get('historial') //retorna datos por enrutador
	async getAllGastosOperacion(@Response() res:any, @Body() ids:RetrieveGastosOpDTO):Promise<responseInterface>
	{
		this._Response = await this._gastosOperacion.getAllGastosOperacion(ids);
		return res.status(this._Response.status).json(this._Response);
	}

	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'COLLECTOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Get('historial/detalles') //retorna un slot del historial en especifico
	async getOneGastoOperacion(@Response() res:any, @Body() ids:RetrieveGastosOpDTO):Promise<responseInterface>
	{
		this._Response = await this._gastosOperacion.getOneGastoOperacion(ids);
		return res.status(this._Response.status).json(this._Response);
	}

	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'COLLECTOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Post('')
	async postOneGastosOperacion(@Response() res:any, @Body() body:CreateGastosOpDTO):Promise<responseInterface>
	{
		this._Response = await this._gastosOperacion.postOneGastosOperacion(body);
		return res.status(this._Response.status).json(this._Response);
	}

	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Put('')
	async putOneGastosOperacion(@Response() res:any, @Body() body:ModifyGastosOpDTO):Promise<responseInterface>
	{
		this._Response = await this._gastosOperacion.putOneGastosOperacion(body);
		return res.status(this._Response.status).json(this._Response);
	}

	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Delete('borrar')
	async deleteOneGastosOperacion(@Response() res:any, @Body() body:DeleteGastosOpDTO):Promise<responseInterface>
	{
		this._Response = await this._gastosOperacion.deleteOneGastosOperacion(body);
		return res.status(this._Response.status).json(this._Response);
	}

}
