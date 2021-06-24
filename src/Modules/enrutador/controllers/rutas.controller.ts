import { Response, Controller, Get, Post, Body, Put, Param, Delete, UseGuards , Request} from '@nestjs/common';
import {SameUserAuthGuard} from 'src/Modules/auth/guards/same-user-auth.guard';
import { responseInterface } from 'src/Response/interfaces/interfaces.index';
import { RutaDto } from '../models/dto/ruta.dto';
import { RutaService } from '../services/ruta.service';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";

@Controller('enrutador/rutas')
export class RutasController
{
    private _Response:responseInterface;

    constructor
    (
        private _rutaService:RutaService
    ){}

    // @Get('hello')
    // sayHello()
    // {
    //     console.clear();
    //     return "Controlador de rutas activo";
    // }

    // obtener todos los clientes a partir de una ruta
    // @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    // @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('/clientsbyroute/:ruta')
    async getAllClientsByRoute(@Param('ruta') params:string, @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._rutaService.getAllClientsByRoute(params);

        console.log('respuesta final', this._Response);

        return res.status(this._Response.status).json(this._Response);

    }

    @Get('allRoutes')
    async getAllClientsAdmin( @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._rutaService.getAllGlobalRoutes();
        return res.status(this._Response.status).json(this._Response);
    }

    // @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    // @UseGuards(AuthGuard('jwt'), RoleGuard)
    //necesito el id del enrutador para escupir todas las rutas q le pertenecen
    // @RolesDecorator('ADMIN_ROLE','ENRUTATOR_ROLE')
    // @UseGuards(AuthGuard('jwt'), RoleGuard, SameUserAuthGuard)
    @Get('/bysocio/:id')
    async getAllRoutes(@Param('id') enrutador:string, @Request() req: any,@Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._rutaService.getAllRoutes(req.page, enrutador);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    //necesito el id de ruta para obtener la ruta deseada
    @Get('/:ruta/:iduser')
    async getOneRoute(@Param('ruta') params:string, @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._rutaService.getOneRoute(params);
        return res.status(this._Response.status).json(this._Response);
    }



    // @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    // @UseGuards(AuthGuard('jwt'), RoleGuard)
    //tomo el formulario de rutas y creo una nueva
    /* @RolesDecorator('ADMIN_ROLE','ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard ) */
    @Post('crear')
    async createNewRoute(@Body() body:RutaDto, @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._rutaService.createNewRoute(body);
        return res.status(this._Response.status).json(this._Response);
    }

    /* @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    //tomo el mismo formulario mas el id de ruta y la modifico */
    @Put('modificar/:route')
    async modifyRoute(@Param('route') route:string, @Body() body:RutaDto, @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._rutaService.modOneRoute(route, body);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    //necesito el id de la ruta para borrarla
    @Delete('eliminar/:id')
    async deleteRoute(@Param('id') id:string, @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._rutaService.delOneRoute(id);
        return res.status(this._Response.status).json(this._Response);
    }


}
