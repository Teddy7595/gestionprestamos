import
{
    Body,
    Response,
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    UseGuards
}
from '@nestjs/common';
import
{
    responseInterface
}
from 'src/Response/interfaces/interfaces.index';
import {modifyCobroClienteDto} from '../models/dto/cobro.dto';
import
{
    createCobroClienteDto
}
from '../models/dto/index.dto';
import {CobrosClienteService} from '../services/services.index';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";

@Controller('cliente/cobros')
export class CobrosClienteController
{
    private _Response:responseInterface;

    constructor
    (
        private _cobroService:CobrosClienteService
    ){}

    @Get('hello')
    async sayhello(@Response() res:any):Promise<responseInterface>
    {
        return res.status(200).json("ruta para control de cobros");
    }


    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('realizados/:cliente')
    async getAllPaymentDo(@Param('cliente') id:string, @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._cobroService.getAllPaymentDo(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'COLLECTOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('realizado/:pago')
    async getOnePaymentDo(@Param('pago') id:string, @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._cobroService.getOnePaymentDo(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'COLLECTOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post('generar')
    async createNewPayment(@Body() body:createCobroClienteDto, @Response() res:any):Promise <responseInterface>
    {
        this._Response = await this._cobroService.createNewPayment(body);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'COLLECTOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Put('modificar')
    async modifyOldPayment(@Body() body:modifyCobroClienteDto, @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._cobroService.modifyOldPayment(body);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Delete('borrar/:id')
    async deleteOldPayment(@Param('id') id:string, @Response() res:any):Promise<responseInterface>
    {
        this._Response;
        return res.status(this._Response.status).json(this._Response);
    }
}
