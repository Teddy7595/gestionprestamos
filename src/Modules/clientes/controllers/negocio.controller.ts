import { Param, Response, Controller, Get, Body, Post, Put, Delete, UseGuards } from '@nestjs/common';
import {responseInterface} from 'src/Response/interfaces/interfaces.index';
import
{
    NegocioCreacionDto,
    NegocioModificacionDto,
    NegocioPeticionDto,
    NegocioUnicoPeticionDto
}
from '../models/dto/index.dto';
import {NegocioService} from '../services/services.index';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";

@Controller('negocio')
export class NegocioController
{
    private _Response:responseInterface;

    constructor
    (
        private _negocioService:NegocioService
    ){}

    @Get('hello')
    async sayHello(@Response() res:any):Promise<responseInterface>
    {
        return res.status(200).json("ruta para asigancion e negocios de clientes");
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get()//ruta para obtener todos los negocios de un cliente
    async getAllNegocio(@Response() res:any, @Body() value:NegocioPeticionDto):Promise<responseInterface>
    {
        this._Response = await this._negocioService.getAllNegocio(value);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('detalles')//ruta para obtener un negocio hecho por el cliente
    async getOneNegocio(@Response() res:any, @Body() value:NegocioUnicoPeticionDto):Promise<responseInterface>
    {
        this._Response = await this._negocioService.getOneNegocio(value);
        return res.status(this._Response.status).json(this._Response);
    }

    @Post('/crear/:id/:idRuta')
    // async makeOneNegocio( @Param('id') idUser:string, @Param('idRuta') idRuta:string , @Response() res:any, @Body() value: any):Promise<responseInterface>
    async makeOneNegocio(@Response() res:any, @Body() value: any, @Param('idRuta') idRuta:string ):Promise<responseInterface>
    {

        // console.log('entra');
        this._Response = await this._negocioService.makeOneNegocio(value, idRuta);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Put('modificar')
    async modifyOneNegocio(@Response() res:any, @Body() value:NegocioModificacionDto):Promise<responseInterface>
    {
        this._Response = await this._negocioService.modifyOneNegocio(value);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Delete('eliminar')
    async deleteOneNegocio(@Response() res:any, @Body() value:any):Promise<responseInterface>
    {
        //this._Response = await ;
        return res.status(this._Response.status).json(this._Response);
    }






// -------------------------------------------------------------------------




// @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
// @UseGuards(AuthGuard('jwt'), RoleGuard)
// @Post('crear')
// async makeOneNegocio(@Response() res:any, @Body() value:NegocioCreacionDto):Promise<responseInterface>
// {
//     this._Response = await this._negocioService.makeOneNegocio(value);
//     return res.status(this._Response.status).json(this._Response);
// }













}
