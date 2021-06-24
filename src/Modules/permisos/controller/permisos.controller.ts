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
	PermisoService
} from '../services/index.service';

import
{
	UserPermisosDTO,
	ModifyPermisosDTO
} from '../models/dto/index.dto';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {PermisosGuard} from '../guards/permisos.index.guard';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";


@Controller('permisos')
export class PermisoController
{
	private _Response:responseInterface;

	constructor
	(
		private _permisoService:PermisoService
	){}

	@UseGuards(AuthGuard('jwt'), PermisosGuard)
	@Get('hello')
	async sayHello(@Response() res:any):Promise<responseInterface>
	{
		return res.status(200).json("ruta de control de permisos");
	}

	@Get('all/:enrutador')//servicio que entrega todas las nominas que maneja el enrutador
	async getAllPermisos(@Param('enrutador') permiso:string, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._permisoService.getAllPermisos(permiso);
		return res.status(this._Response.status).json(this._Response);
	}

	@Get('detalles/:id')//servicio que me entrega detalladamente un permiso a traves del id
	async getOnePermisos(@Param('id') permiso:string, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._permisoService.getOnePermiso(permiso);
		return res.status(this._Response.status).json(this._Response);
	}

	@Get('user/:id')//servicio que me entrega detalladamente un permiso a traves del id
	async getOnePermisoByUser(@Param('id') permiso:string, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._permisoService.getOnePermisoByUser(permiso);
		return res.status(this._Response.status).json(this._Response);
	}

	@Post('crear')//servicio para crear una nueva tabla de permisos
	async createNewPermisos(@Body() permiso:UserPermisosDTO, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._permisoService.createNewPermisos(permiso);
		return res.status(this._Response.status).json(this._Response);
	}

	@Put('modificar')//servicio para modificar una tabla de permisos
	async modifyOnePermiso(@Body() permiso:ModifyPermisosDTO, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._permisoService.modifyOnePermiso(permiso);
		return res.status(this._Response.status).json(this._Response);
	}

	@Delete('borrar/:id')
	async deleteOnePermiso(@Param('id') permiso:string, @Response() res:any):Promise<responseInterface>
	{
		this._Response = await this._permisoService.deleteOnePermiso(permiso);
		return res.status(this._Response.status).json(this._Response);
	}
}
