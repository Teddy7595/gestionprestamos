import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { EstadisticaService } from './estadistica.service'
import { Negocio_EstadisticaService } from './negocio.stadistica.service'
import { Pagos_EstadisticaService } from './pagos.estadistica.service'
import { Rutas_EstadisticaService } from './rutas.estadistica.service'
import { Cajachica_EstadisticaService } from './cajachica.estadistica.service'

@Injectable()
/**
*	Servicio dedicado a la manipulación de servicios autonomos
*/
export class HandlerStatService 
{
	private readonly debug:boolean //true paa modo de pruebas y fals para modo de produccion
	private readonly logger:Logger //log del CRON
	private static readonly timeDBG:string = '*/10 * * * * *' //tiempo para debugeo
	private static readonly timePRD:string = '00 30 4 */1 * *' //tiempo para producccion
	private ClusterErutators:Array<any> //Cluster de enrutadores globales para evitar llamados extra a la base de datos
	private t_Enrutators:number //Cantidad total de enrutadores dentro del sistema
	private ClusterRoutes:Array<any> //Cluster de rutas

	constructor
	(
		private readonly _statServices:EstadisticaService,
		private readonly _bussinesStatService:Negocio_EstadisticaService,
		private readonly _paytmentStatService:Pagos_EstadisticaService,
		private readonly _routeStatService:Rutas_EstadisticaService,
		private readonly _cajaCHStatService:Cajachica_EstadisticaService
	)
	{
		this.debug = true //seteo de modo de pruebas
		this.logger = new Logger("CRONHANDLER") 
		this.logger.setContext("Sistema automatizado de estadisticas") 
	}

	
	// "5f9a8465a39bda0c1c5b971a" -> id del enrutador de pruebas 
	@Cron(HandlerStatService.timeDBG,
    { 
        name: "Manejo de Estadísticas" 
    })
    private async handleCron()
    {//el valor debug lo uso para probar funciones sin tener que guardar en base...
		this.ClusterErutators = new Array<any>()
		this.t_Enrutators = 0
		this.ClusterErutators = await this._statServices.getEnrutatorsToOtherService()
		this.t_Enrutators     = await this._statServices.getTotalEnrutatorsToOtherService()
		this.ClusterRoutes    = await this._statServices.getRoutesToOtherService()

		if (this.debug) //condicional que me permite debuguear procesos y funciones
		{
			console.clear() 
			console.log('\n');
			this.logger.debug(' #MODO DEBUG, procedimientos en pruebas... \n\n')
		} 

		await this._statServices.systemStats(this.debug)
		await this._bussinesStatService.generateTraceStatsBussines(this.ClusterErutators, this.t_Enrutators, this.debug)
		await this._paytmentStatService.generateTraceStatsPayment(this.ClusterErutators, this.t_Enrutators, this.debug)
		await this._routeStatService.generateTraceStatRoutes(this.ClusterErutators, this.ClusterRoutes, this.t_Enrutators, this.debug)
		await this._cajaCHStatService.generateTraceStatsPettyCash(this.ClusterErutators, this.t_Enrutators, this.debug)

		this.ClusterErutators = null
		this.t_Enrutators = null
		
    }
}
