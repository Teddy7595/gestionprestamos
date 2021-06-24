import { Param, Body, Controller, Get, Post, Response, UseGuards } from '@nestjs/common';
import { responseInterface } from 'src/Response/interfaces/interfaces.index';
import 
{ 
    EstadisticaService, 
    Negocio_EstadisticaService, 
    Pagos_EstadisticaService, 
    Rutas_EstadisticaService,
    Cajachica_EstadisticaService 
} from '../services/index.services';

import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";

@Controller('estadisticas')
export class EstadisticasController 
{
	private _Response:responseInterface;

	constructor
	(
		private readonly _estadisticaServices:EstadisticaService,
        private readonly _bussinesServices:Negocio_EstadisticaService,
        private readonly _paymentServices:Pagos_EstadisticaService,
        private readonly _routeServices:Rutas_EstadisticaService,
        private readonly _cajaCHService:Cajachica_EstadisticaService
	){} 

	@Get("hello")
    async sayHello()
    {
        return "Controlador de las estadisticas, funcionando";
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('cobros/stats/:enrutador')
    async getPaymentStatsByEnrutator(@Param('enrutador') id:string, @Response() res:any): Promise<responseInterface>
    {//función que retorna la cantidad de negocios totales que maneja el enrutador
        
        this._Response = await this._paymentServices.getStatsPaymentByEnrutator(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('cobros/traza/stats/:enrutador')
    async getPaymentTraceByEnrutator(@Param('enrutador') id:string, @Response() res:any): Promise<responseInterface>
    {//función que retorna la cantidad de negocios totales que maneja el enrutador
        
        this._Response = await this._paymentServices.getTraceBussinesByEnrutator(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('negocios/cantidad/:enrutador')
    async countBussinesByEnrutator(@Param('enrutador') id:string, @Response() res:any): Promise<responseInterface>
    {//función que retorna la cantidad de negocios totales que maneja el enrutador
        
        this._Response = await this._estadisticaServices.countBussinesByEnrutator(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('negocios/stats/:enrutador')
    async getBussinesStatsByEnrutator(@Param('enrutador') id:string, @Response() res:any): Promise<responseInterface>
    {//función que retorna el estatus de los negocios manejados por un enrutador
        
        this._Response = await this._bussinesServices.getStatsBussinesByEnrutator(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('negocios/traza/stats/:enrutador')
    async getBussinesTraceByEnrutator(@Param('enrutador') id:string, @Response() res:any): Promise<responseInterface>
    {//función que retorna el historico de los negocios manejados por un enrutador
        
        this._Response = await this._bussinesServices.getTraceBussinesByEnrutator(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('cobradores/cantidad/:enrutador')
    async countCollectorByEnrutator(@Param('enrutador') id:string, @Response() res:any): Promise<responseInterface>
    {//función que retorna la cantidad de cobradores totales que maneja el enrutador
        
        this._Response = await this._estadisticaServices.countCollectorByEnrutator(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('rutas/cantidad/:enrutador')
    async countRoutesByEnrutator(@Param('enrutador') id:string, @Response() res:any): Promise<responseInterface>
    {//función que retorna la cantidad de rutas totales que maneja el enrutador
        
        this._Response = await this._estadisticaServices.countRoutesByEnrutator(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('rutas/stats/:enrutador')
    async getRouteStatsByEnrutator(@Param('enrutador') id:string, @Response() res:any): Promise<responseInterface>
    {//función que retorna la data del dia que se maneja en las rutas por el enrutador
        
        this._Response = await this._routeServices.getStatsRoutesByEnrutator(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('rutas/traza/stats/:enrutador')
    async getRouteTraceByEnrutator(@Param('enrutador') id:string, @Response() res:any): Promise<responseInterface>
    {//función que retorna la traza de rutas totales que maneja el enrutador
        
        this._Response = await this._routeServices.getTraceRoutesByEnrutator(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('clientes/cantidad/:enrutador')
    async countClientByEnrutator(@Param('enrutador') id:string, @Response() res:any): Promise<responseInterface>
    {//función que retorna la cantidad de clientes totales que maneja el enrutador
        
        this._Response = await this._estadisticaServices.countClientByEnrutator(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('cajach/stats/:enrutador')
    async getStatPettyCashByEnrutator(@Param('enrutador') id:string, @Response() res:any): Promise<responseInterface>
    {//función que retorna las estadisticas diarias de las cajas chichas
        
        this._Response = await this._cajaCHService.getStatsPettyCashByEnrutator(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('cajach/traza/stats/:enrutador')
    async getTracePettyCashByEnrutator(@Param('enrutador') id:string, @Response() res:any): Promise<responseInterface>
    {//función que retorna la traza de caja chicas totales que maneja el enrutador
        
        this._Response = await this._cajaCHService.getTracePettyCashByEnrutator(id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('admin/stats')
    async getAdminStats(@Response() res:any): Promise<responseInterface>
    {//función que retorna resumen del sistema, la cantidad de todos los datos registrados...
        
        this._Response = await this._estadisticaServices.getAllSystemResumeByAdmin();
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get('admin/traza/stats')
    async getAdminTraceStats(@Response() res:any): Promise<responseInterface>
    {//función que retorna resumen del sistema, la cantidad de todos los datos registrados...
        
        this._Response = await this._estadisticaServices.getTraceSystemStatsByAdmin();
        return res.status(this._Response.status).json(this._Response);
    }
}
