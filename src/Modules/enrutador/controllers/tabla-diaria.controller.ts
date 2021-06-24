import { Controller, Get, Param, Post, UseGuards, Response, Body } from '@nestjs/common';

import {TablaDiariaService} from '../services/services.index'

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";
import { responseInterface } from 'src/Response/interfaces/interfaces.index';


@Controller('tablaDiaria')
export class TablaDiariaController 
{
    private _Response:responseInterface;

    constructor
    (
        private _tablaDiariaService:TablaDiariaService
    ){}

    @Get("hello")
    async sayHello()
    {
        return "Controlador de las tablas diarias, funcionando";
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post('enrutador/:enrutador')
    async obtenerDatosDiariosEnrutador(@Param('enrutador') id:string, @Response() res:any): Promise<responseInterface>
    {
        this._Response = await this._tablaDiariaService.getDiallyByEnrutator(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'COLLECTOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post('cobrador/:cobrador')
    async obtenerDatosDiariosCobrador(@Param('cobrador') id:string, @Response() res:any): Promise<responseInterface>
    {
        this._Response = await this._tablaDiariaService.getDiallyByEnrutator(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post('guardar/:idNegocio/:idRuta')
    async gurdarManualmente(@Body() id:string[], @Response() res:any): Promise<responseInterface>
    {
        this._Response = await this._tablaDiariaService.manualSaveITem(id['idNegocio'], id['idRuta']);
        return res.status(this._Response.status).json(this._Response);
    }
}
