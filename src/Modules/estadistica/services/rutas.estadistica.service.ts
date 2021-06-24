import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EstadisticaService } from './estadistica.service'
import 
{ 
	responseInterface, 
	_argsFind, 
	_argsPagination, 
	_argsUpdate, 
	_configPaginator, 
	_dataPaginator 
} from 'src/Response/interfaces/interfaces.index'
import { Ruta } from 'src/Modules/enrutador/models/schemas/ruta.schema' 
import { TrazaRutaSystema} from 'src/Modules/estadistica/models/schemas/rutas.estadistica.schema'
import{RoutesInterface} from '../models/interfaces/trace.routes.interface'

@Injectable()
export class Rutas_EstadisticaService 
{
	private readonly logger:Logger
	private _SystemResponse:responseInterface
	private _Response:responseInterface
	private ClustertraceDB:Array<any>
	private ClusterEnrutators:Array<any>
	private ClusterRoutes:Array<any>
	private t_Enrutator:number
	private routesTrace:RoutesInterface

	constructor
	(
		private readonly _statService:EstadisticaService,
		@InjectModel(Ruta.name) private readonly _rutaModel:Model<Ruta>,
		@InjectModel(TrazaRutaSystema.name) private _traceRouteModel:Model<TrazaRutaSystema>
	)
	{
		this.logger = new Logger("Estadisticas de rutas", true) 
		this.logger.setContext("Estadisticas de rutas")
		this.routesTrace = 
		{
			'n_routes'          	:0,//numero de rutas que maneja un enrutador
			'nb_route_low'  		:0,//numero de negocios en la ruta con menos prestamos (negocios)
			'nb_route_high' 		:0,//numero de negocios en la ruta con mas prestamos (negocios)
			//'value_bussines_high'   :0,//valor del prestamo mas alto
			//'value_bussines_low'    :0,//valor del prestamo mas bajo
			'enrutador_id'	    	:'',//:id del enrutador ncargado
			'route_id_bc_low'   	:'',//id de la ruta con menos negocios
			'route_id_bc_high'  	:'',//id de la ruta con mas negocios
			//'idRoute_low_bussines'  :'',//id de la ruta con el negocio mas bajo
			//'idRoute_high_bussines' :'' //id de la ruta con el negocio mas alto
		}
	}
	//--------funciones públicas de usuario-------------
	/**
		Funcion que trae los datos del dia acerca de las rutas
	*/
	public async getStatsRoutesByEnrutator(id:string):Promise<responseInterface>
	{//funcion que me retorno la traza del dia
		this._Response = await this.getStatsRoutesByEnrutatorInSystem(id)

		return this._Response
	}

	/**
		Funcion que retorna la data guardada en base a través del ID del enrutador
		todas las funciones que tienen el getDataBySystem, traen la data sin usar 
		paginador, si se desea modificr e implementar el paginador, solo debe cambiar
		a la funcion getDataBySystemWithPaginator para implementar el paginador
	*/
	public async getTraceRoutesByEnrutator(id:string):Promise<responseInterface>
	{
		const args: _argsFind = 
        {
            findObject: {enrutador_id: id}  
        }
		this._Response = await this._statService.getDataBySystem(this._traceRouteModel, args)

		return this._Response
	}

	//--------funciones públicas de sistema-------------
	/**
	  funcion que genera la traza de estadisticas dependiendo del id del enrutador
	*/
	private async getStatsRoutesByEnrutatorInSystem(id:string):Promise<responseInterface>
	{	
		this._SystemResponse          = await this._statService.getRoutesByEnrutatorsToOtherService(id)
		this.routesTrace.enrutador_id = id

		if (this._SystemResponse.ok) 
		{
			this.routesTrace.n_routes     = this._SystemResponse.data.length || 0
			this.ClusterRoutes			  = this._SystemResponse.data

			//filtro los valores altos
			this.routesTrace.route_id_bc_high = (this.getCountLowerOrHigherModel(this.ClusterRoutes, 'idHigherCountBussines')).toString()
			this.routesTrace.nb_route_high    = this.getCountLowerOrHigherModel(this.ClusterRoutes, 'higherCountBussines')
			//filtro los valores bajos
			this.routesTrace.route_id_bc_low = (this.getCountLowerOrHigherModel(this.ClusterRoutes, 'idLowerCountBussines')).toString()
			this.routesTrace.nb_route_low    = this.getCountLowerOrHigherModel(this.ClusterRoutes, 'lowerCountBussines')

			this._SystemResponse.data = this.routesTrace
		}else
		{
			this._SystemResponse.data = []
		}

		return this._SystemResponse
	}

	/**
	  funcion experimental usando una tabla de funciones para volver la funcion mas extensible y mantenible,
	  la finalidad de esta funcion es contabilizar la cntidad de negocios existentes en una ruta manejada
	  por un enrutador
	*/
	private getCountLowerOrHigherModel(dataCluster:Array<any>, type:string)
	{

		const func:object =
		{
			higherCountBussines: (prev:Ruta, current:Ruta) => //rutas con mas negocios
						    	 (prev.negocios_id.length > current.negocios_id.length)? 
						     	  prev.negocios_id.length : current.negocios_id.length,

			lowerCountBussines: (prev:Ruta, current:Ruta) => //rutas con menos negocios
						   	    (prev.negocios_id.length < current.negocios_id.length)? 
						         prev.negocios_id.length : current.negocios_id.length,

			idHigherCountBussines: (prev:Ruta, current:Ruta) => //id de rutas con mas negocios
						  	       (prev.negocios_id.length > current.negocios_id.length)? 
						  	        prev._id : current._id,

			idLowerCountBussines: (prev:Ruta, current:Ruta) => //id de rutas con menos negocios
						  	      (prev.negocios_id.length < current.negocios_id.length)? 
						  	       prev._id : current._id
		}

		return dataCluster.reduce(func[type])//le paso la funcion establecida al cluster para evaluar y retorno el resultado...
	}

	/**
	  funcion que guarda la traza en la base de datos a través del cluster
	*/
	private async saveClusterRouteTrace()
	{//Guardo en base de datos la traza generada de negocios por cada enrutador
		if (this.ClustertraceDB.length  > 0) 
		{
			for(let i:number =0; i <this.t_Enrutator; i++)
			{
				this._SystemResponse = await this._statService.saveDataBySystem(this.ClustertraceDB[i])
				
			}

		}else
		{
			this.logger.debug('   No existen rutas en estos momentos...154, saltando procedimiento...')
		}
	}

	//--------funciones públicas de sistema-------------
	/**
		Funcion que toma el cluster de enrutadores y uno a uno genera su traza de estatus y estadistica
		usando la funcion dedicada a un solo enrutador
	*/
	private async generateTrace()
	{//funcion que genera la traza paa guardarle en base
		if(this.ClusterEnrutators.length > 0)
		{
			for(let i:number =0; i <this.t_Enrutator; i++)
			{
				await this.getStatsRoutesByEnrutatorInSystem(this.ClusterEnrutators[i]._id.toString());
				(this._SystemResponse.ok)? await this.ClustertraceDB.push(new this._traceRouteModel(this.routesTrace)) : false;
			}

		}else
		{
			this.logger.debug('   No existen enrutadores en estos momentos...176, saltando procedimiento...')
		}
	}

	public async generateTraceStatRoutes(dataCluster:Array<any>, routeCluster:Array<any>,t_Enrutators:number, debug:boolean =false)
	{
		this.logger.debug('   12)Generando estadisticas de rutas...')
		this.ClustertraceDB    = new Array<any>()
		this.ClusterEnrutators = dataCluster
		this.ClusterRoutes     = routeCluster
		this.t_Enrutator 	   = t_Enrutators
		await this.generateTrace()

		if(debug)
		{
			this.logger.debug(' ESTADISTICAS DE RUTAS EN MODO DEBUG, NO GUARDA DATOS EN BASE...')
			console.log("\nRUTAS MANEJADAS POR UN ENRUTADOR:", await this.getTraceRoutesByEnrutator('5f9a8465a39bda0c1c5b971a'))
			//console.log("\nCLUSTER DE ENRUTADORES EN RUTAS:\n", this.ClusterEnrutators)
			console.log("\nCLUSTER DE RUTAS:\n", this.ClustertraceDB)
		
		}else
		{
			this.logger.debug('   13)Guardando para histórico de estadisticas de rutas...')
			this.saveClusterRouteTrace()
		}

		this.ClusterEnrutators = null
		this.ClustertraceDB    = null
		this.ClusterEnrutators = null
		this.ClusterRoutes     = null
		this.t_Enrutator 	   = null
	}

}
