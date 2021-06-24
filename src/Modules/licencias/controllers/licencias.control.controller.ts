import { Controller, Response, Get, Post, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { responseInterface } from 'src/Response/interfaces/interfaces.index';
import
{
    modifyUserLicenciaDto,
    solicitudLicenciaDto ,
    setLicenciaUserDto
}
from '../models/dto/dto.index';
import
{
    ControlLicenciaService
}
from '../services/services.index';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";

@Controller('licencias/control')
export class ControlLicenciasController
{
    private _Response:responseInterface;

    constructor
    (
        private _controlLicenciaService: ControlLicenciaService,
    ){}

    @Get('hello')
    async sayHello( @Response() res:any ):Promise<responseInterface>
    {
        return res.status(200).json("ruta de gestion y control interno de licencias gral");
    }

    /*@RolesDecorator('ADMIN_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post('reloj')//ruta que configura el sistema de reloj de conteo de dias
    async setOnOffTimer(@Body() body:any, @Response() res:any):Promise<responseInterface>
    {
        this._Response;
        return res.status(this._Response.status).json(this._Response);
    }*/

}
