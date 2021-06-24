import { Controller, Param, Body, Response, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { responseInterface } from 'src/Response/interfaces/interfaces.index';
import
{
    creationLicenciaDto,
    modifyLicenciaDto
}
from '../models/dto/dto.index';
import
{
    LicenciasService
}
from '../services/services.index';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";

@Controller('licencias')
export class LicenciasController
{
    private _Response:responseInterface;

    constructor
    (
        private _licenciaService:LicenciasService
    ){}

    @Get('hello')
    async sayHello( @Response() res:any ):Promise<responseInterface>
    {
        return res.status(200).json("ruta especializadas en licencias y solicitudes de las mismas");
    }

    @RolesDecorator('ADMIN_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get()//obtengo todas las licencias creadas
    async getAllLicencias( @Response() res:any ):Promise<responseInterface>
    {
        this._Response = await this._licenciaService.getAllLicencias();
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post('crear')//paso el formulario de creación de licencias
    async createNewLicencia(@Body() body:creationLicenciaDto, @Response() res:any ):Promise<responseInterface>
    {
        this._Response = await this._licenciaService.createNewLicencia(body);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Put('modificar/:id')//paso el formulario de creación de licencias para modificarla
    async modifyLicencia(@Param('id') id:string ,@Body() body:creationLicenciaDto, @Response() res:any ):Promise<responseInterface>
    {
        this._Response = await this._licenciaService.modifyLicencia(body, id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Delete('eliminar/:id')//elimino una licencia con el id
    async deleteLicencia(@Param('id') id:string ,@Response() res:any ):Promise<responseInterface>
    {
        this._Response = await this._licenciaService.deleteLicencia(id);
        return res.status(this._Response.status).json(this._Response);
    }
}
