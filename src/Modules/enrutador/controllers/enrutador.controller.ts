import { Body, Controller, Get, Post, Response, UseGuards } from '@nestjs/common';
import { responseInterface } from 'src/Response/interfaces/interfaces.index';
import { GenerarReferidoDto } from '../models/dto/dto.index';
import { EnrutadorService } from '../services/services.index';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";

@Controller('enrutador')
export class EnrutadorController
{
    private _Response:responseInterface;

    constructor
    (
        private _enrutadorService:EnrutadorService
    ){}

    @Get("hello")
    async sayHello()
    {
        return "Controlador de los enrutadores, funcionando";
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post('referencia')
    async generarReferencia(@Body() body:GenerarReferidoDto, @Response() res:any): Promise<responseInterface>
    {
        this._Response = await this._enrutadorService.generarReferido(body);
        return res.status(this._Response.status).json(this._Response);
    }



    //@Post("referir")
    //async registrarReferido()
}
