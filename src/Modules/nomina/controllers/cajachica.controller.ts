import {
  Controller,
  Response,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards
} from '@nestjs/common';

import
{
	responseInterface
} from 'src/Response/interfaces/interfaces.index';

import
{
	CajachicaService
} from '../services/cajachica.service';

import
{
	CreateCajaChicaDTO,
	ModifyCajaChicaDTO
} from '../models/dto/cajachica.dto';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";


@Controller('cajachica')
export class CajachicaController
{
	private _Response:responseInterface;

	constructor
	(
		private _cajachicaService:CajachicaService
	){}

	@Get('hello')
	async sayHell(@Response() res:any):Promise<responseInterface>
	{
		return res.status(200).json(await this._cajachicaService.sayHello());
	}

	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Get('all/:enrutador')//metodo que retorna todas las cajas chicas asignadas atraves de un enrutador
	async getAllCajachicaByEnrutator(@Param('enrutador') id:string, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._cajachicaService.getAllCajachicaByEnrutator(id);
		return res.status(this._Response.status).json(this._Response);
	}

	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'COLLECTOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Get('detalles/:id')//metodo que me retorna una caja chica en particular
	async getOneCajachicaByID(@Param('id') id:string, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._cajachicaService.getOneCajachicaByID(id);
		return res.status(this._Response.status).json(this._Response);
	}

	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Post('crear')//método para crear una caja chica
	async postOneCajachica(@Body() caja:CreateCajaChicaDTO, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._cajachicaService.postOneCajachica(caja);
		return res.status(this._Response.status).json(this._Response);
	}

	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Put('modificar')//método para modificar una caja chica desde el id del cobrador
	async putOneCajachica(@Body() caja:ModifyCajaChicaDTO, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._cajachicaService.putOneCajachica(caja);
		return res.status(this._Response.status).json(this._Response);
	}

	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Delete('eliminar/:id')//método que me permite borrar una caja chica por ID
	async delCajachicaByID(@Param('id') id:string, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._cajachicaService.delCajachicaByID(id);
		return res.status(this._Response.status).json(this._Response);
	}

}
