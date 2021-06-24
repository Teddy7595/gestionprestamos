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
import { BussinesTrace } from '../models/interfaces/index.interface'
import { _TRAZAESTADISTICASYSTEMACHEMA } from '../models/schemas/index.schema'
import { Negocio } from 'src/Modules/clientes/models/schemas/negocio.schema'
import { TrazaNegocioSystema } from '../models/schemas/negocio.estadistica.schema'

/**TODO
 * Obtener por enrutador: ->listo
 * Prestamos mas alto y bajo ->listo
 * Cantidad de prestamos ->listo
 * A que cliente le pretenece el prestamo mas bajo y alto ->listo
 * Generar en base de datos la taza de sistema -> listo
 */

@Injectable()
export class Negocio_EstadisticaService 
{

	private traceBussines:BussinesTrace//objeto que contendrá los datos estadisticos de negocio
	private _Response:responseInterface //interfaz de respuesta a usuario
	private _SystemResponse:responseInterface //interfaz de respuesta a sistema
	private logger:Logger //logger
	private ClustertraceDB:Array<TrazaNegocioSystema> //variable para guardar en base de datos la traza de los negocios
	private ClusterEnrutators:Array<any> //cluster para guardar a los enrutadores
 	private t_Enrutator:number //total de enrutadores

	//necesito negocios, enrutadores, clientes, cobradores
	 //si la funcion getDataBySystem es muy pesada puede usar el getDataBySystemWithPaginator en caso de necesitar un paginador
	constructor
	(
		private readonly _statService:EstadisticaService,
		@InjectModel(TrazaNegocioSystema.name) private _trazaBussinesModel:Model<TrazaNegocioSystema>
	)
	{
		
		this.logger = new Logger("Estadisticas de negocio") 
		this.logger.setContext("Estadisticas de negocio")
		this.t_Enrutator = 0
		this.traceBussines =
		{
			enrutador_id	:"", 
			cobrador_id_low :"",
			cobrador_id_high:"",  
			pclient_low		:"",  
			pclient_high	:"",  
			prestamo_low	:0, 
			prestamo_high	:0, 
			prestamo_count	:0  
		}
		
	}
	//--------funciones públicas de usuario-------------
	public async getStatsBussinesByEnrutator(id:string):Promise<responseInterface>
	{
		this._Response = await this.getStatsBussinesBynrutatorInSystem(id)
		return this._Response
	}

	public async getTraceBussinesByEnrutator(id:string):Promise<responseInterface>
	{//funcion que retorna el historico de negocios tabajados por un enrutador
		const args: _argsFind = 
        {
            findObject: {enrutador_id: id}  
        }
		this._Response = await this._statService.getDataBySystem(this._trazaBussinesModel, args)
		return this._Response
	}

	//--------funciones privadas de sistema-------------
	private async getStatsBussinesBynrutatorInSystem(id:string):Promise<responseInterface>
	{//funcion que retorna un objeto con las estadisticas actuales de negocio dependiendo del enrutador
		let aux:Negocio

		//primero busco todos los negocio que pertenecen a un enrutador
		this._SystemResponse = await this._statService.getBussinesBySystemUsingIdEnrutator(id)
		this.traceBussines.enrutador_id  = id.toString()

		if(this._SystemResponse.ok)
		{   //primero buscaré los valores altos para mostrar
			aux = this.getLowerOrHigherModel(this._SystemResponse.data.bussines, 1)
			//empiezo a llenar la traza para mostrar
			this.traceBussines.pclient_high      = aux.cliente_id.toString()
			this.traceBussines.cobrador_id_high  = aux.cobrador_id.toString()
			this.traceBussines.prestamo_high     = aux.total
			
			//ahora busco los valores mas bajos
			aux = this.getLowerOrHigherModel(this._SystemResponse.data.bussines, 2)
			//empiezo a llenar la traza para mostrar
			this.traceBussines.pclient_low      = aux.cliente_id.toString()
			this.traceBussines.cobrador_id_low  = aux.cobrador_id.toString()
			this.traceBussines.prestamo_low     = aux.total
			this.traceBussines.prestamo_count   = this._SystemResponse.data.bussines.length

			this._SystemResponse.data = this.traceBussines //concluyo y reescribo la respuesta
		}else
		{
			this._SystemResponse.data = []
			this._SystemResponse.message = 'No se encontró ningún negocio registrado con este enrutador...'
		}
		
		return this._SystemResponse
	}

	private getLowerOrHigherModel(dataCluster:Array<any>, type:number =1)
	{//funcion que me retorna el mayor y el menor valor de un cluster
	 //1 para mayor 2 para menor	
		let func:any = ()=>{}

		switch(type)//seteo el modo en que quiero obtener los datos si mayor o menor
		{
			case 1:
				func = (prev, current)=> (prev.total > current.total)? prev : current
			break;

			case 2:
				func = (prev, current)=> (prev.total < current.total)? prev : current
			break;

			default: return 
		}

		return dataCluster.reduce(func)//le paso la funcion establecida al cluster para evaluar y retorno el resultado...
	}

	private async saveClusterTraceBussines()
	{//Guardo en base de datos la traza generada de negocios por cada enrutador
		for(let i:number =0; i <this.t_Enrutator; i++)
		{
			this._SystemResponse = await this._statService.saveDataBySystem(this.ClustertraceDB[i])
			
		}

		this.logger.debug(' 8)Finalizando histórico de prestamos/negocios, limpiando cluster...')
		this.ClustertraceDB = null
		this.ClusterEnrutators = null

	}

	private async generateTrace()
	{//funcion que genera la traza paa guardarle en base

		this.ClustertraceDB = new Array<TrazaNegocioSystema>() //inicializo el cluster

		if(this.ClusterEnrutators.length > 0)
		{
			for(let i:number =0; i <this.t_Enrutator; i++)
			{
				await this.getStatsBussinesBynrutatorInSystem(this.ClusterEnrutators[i]._id)
				//console.log('\nTRAZA TEMPROAL CREADA:\n', this.traceBussines)
				await this.ClustertraceDB.push(new this._trazaBussinesModel(this.traceBussines))
			}

		}else
		{
			this.logger.debug('No existen enrutadores en estos momentos..., saltando procedimiento...')
			this.ClustertraceDB = null
			this.ClusterEnrutators = null
		}
	}

	//--------funciones públicas de sistema-------------
	public async generateTraceStatsBussines(dataCluster:Array<any>, t_Enrutators:number, debug:boolean =false)
	{//funcion que genera la traza de ngocios para estudios de control de datos
		this.logger.debug(' 6)Generando estadisticas de prestamos...')
		this.ClusterEnrutators = new Array<any>() //inicializo el cluster de enrutadores
		this.t_Enrutator = t_Enrutators//obtengo el total de enrutadores existentes en el sistema
		this.ClusterEnrutators = dataCluster //obtengo a todos los enrutadores
		await this.generateTrace()//genero la traza de negocio
		
		if(debug)
		{
			this.logger.debug(' ESTADISTICAS DE NEGOCIOS EN MODO DEBUG, NO GUARDA DATOS EN BASE...')
			console.log("\nRUTA AL CONTROLADOR server/negocios/stats/:enrutador :\n", await this.getStatsBussinesByEnrutator('5f9a8465a39bda0c1c5b971a'))
			console.log("\nCLUSTER DE ENRUTADORES en negocios:\n", this.ClusterEnrutators)
			console.log("\nCLUSTER DE TRAZA DE NEGOCIOS:\n", this.ClustertraceDB)
		}else
		{
			this.logger.debug(' 7)Guardando para histórico de estadisticas de prestamos...')
			await this.saveClusterTraceBussines() //guardo uno x uno por enrutador las trazas de negocios
		}

		//finalizo ambos clusters hasta la siguiente traza
		this.ClusterEnrutators = null
		this.ClustertraceDB    = null
		this.t_Enrutator 	   = null
	}
	
}
