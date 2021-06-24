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
} from '../../../Response/interfaces/interfaces.index';

import
{
	NominaService
} from '../services/index.services';

import
{
	CreateNominaDTO,
	ModifyNominaDTO
}from '../models/dto/index.dto';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";

@Controller('nomina')
export class NominaController
{

	private _Response:responseInterface;

	constructor
	(
		private _nominaService:NominaService
	)
	{}

	@Get('hello')
	async sayHello(@Response() res:any):Promise<responseInterface>
	{
		return res.status(200).json("ruta de control de nómina");
	}

	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Get('all/:enrutador')//servicio que entrega todas las nominas que maneja el enrutador
	async getAllNominas(@Param('enrutador') nomina:string, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._nominaService.getAllNominas(nomina);
		return res.status(this._Response.status).json(this._Response);
	}

 	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'COLLECTOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Get('detalles/:id')//servicio que me entrega detalladamente una nomina en particular, a traves del codigo de nominas
	async getOneNominas(@Param('id') nomina:string, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._nominaService.getOneNomina(nomina);
		return res.status(this._Response.status).json(this._Response);
	}

	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Post('crear')//servicio para crear una nomina, donde requiere el id del cobrador y la id del enrutador, junto a los datos de salario
	async createOneNominas(@Body() nomina:CreateNominaDTO, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._nominaService.createOneNomina(nomina);
		return res.status(this._Response.status).json(this._Response);
	}

	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Put('modificar')//servicio para modificar la nomina de un cobrador
	async modifyOneNominas(@Body() nomina:ModifyNominaDTO, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._nominaService.modifyOneNomina(nomina);
		return res.status(this._Response.status).json(this._Response);
	}

	@RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  	@UseGuards(AuthGuard('jwt'), RoleGuard)
	@Delete('borrar/:id')
	async deleteOneNominas(@Param('id') nomina:string, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._nominaService.deleteOneNomina(nomina);
		return res.status(this._Response.status).json(this._Response);
	}


}
