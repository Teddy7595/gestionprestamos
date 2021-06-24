import
{
    Controller,
    Response,
    Body,
    Get,
    Post,
    UseGuards
}
from '@nestjs/common';
import {responseInterface} from 'src/Response/interfaces/interfaces.index';
import {BitacoraDto, GetReportDto} from '../models/dto/index.dto';
import {Type} from '../models/enum/index.enum';
import {BitacoraService} from '../services/index.service';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";

@Controller('bitacora')
export class BitacoraMainController
{
    private _Response:responseInterface;

    constructor
    (
        private _bitacoraService:BitacoraService
    ){}

    @Get('hello')
    async sayHello(@Response() res:any): Promise<responseInterface>
    {
        return res.status(200).json("Ruta de modulos de bitácoras");
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'COLLECTOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('report')//ruta para obtener los reporte por role
    async getReportLog(@Body() log:GetReportDto ,@Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._bitacoraService.getReportLog(log);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('report/all')//ruta solo administrativa, para obtener TODOS los roles
    async getAllReportLog(@Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._bitacoraService.getAllReportLog();
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'COLLECTOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('report/detalles')//ruta para obtener los reporte por role
    async getOneReportLog(@Body() log:GetReportDto ,@Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._bitacoraService.getOneReportLog(log);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post('admin')
    async makeLogAdmin(@Body() log:BitacoraDto, @Response() res:any):Promise<responseInterface>
    {
        log.type = Type.ADMIN;
        this._Response = await this._bitacoraService.generateLog(log);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post('enrutador')
    async makeLogEnrutador(@Body() log:BitacoraDto, @Response() res:any):Promise<responseInterface>
    {
        log.type = Type.ENRUTADOR;
        this._Response = await this._bitacoraService.generateLog(log);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('COLLECTOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post('cobrador')
    async makeLogCobrador(@Body() log:BitacoraDto, @Response() res:any):Promise<responseInterface>
    {
        log.type = Type.COBRADOR;
        this._Response = await this._bitacoraService.generateLog(log);
        return res.status(this._Response.status).json(this._Response);
    }
}
