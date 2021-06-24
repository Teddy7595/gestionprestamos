import { Response, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {responseInterface} from 'src/Response/interfaces/interfaces.index';
import {PeticionesCobrosService} from '../services/services.index';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";

@Controller('cliente/cobros/control')
export class PeticionCobrosController
{
    private _Response:responseInterface;

    constructor
    (
        private _peticionService:PeticionesCobrosService
    ){}

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get(':enrutador')
    async getAllCobrosByEnrutador(@Param('enrutador') id:string, @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._peticionService.getAllCobrosByEnrutador(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('peticion/:peticion')
    async getOneCobrosById(@Param('peticion') id:string, @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._peticionService.getOneCobrosById(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post('confirmar/:peticion')
    async confirmarOneCobroById(@Param('peticion') id:string, @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._peticionService.confirmarOneCobroById(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post('denegar/:peticion')
    async denegarOneCobroById(@Param('peticion') id:string, @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._peticionService.denegarOneCobroById(id);
        return res.status(this._Response.status).json(this._Response);
    }
}
