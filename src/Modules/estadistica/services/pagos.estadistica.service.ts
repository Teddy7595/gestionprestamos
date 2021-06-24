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
import { PaymentTrace } from '../models/interfaces/index.interface'
import { TrazaPagoSystema } from '../models/schemas/pagos.estadisticas.schema'
import { Cobros } from 'src/Modules/clientes/models/schemas/cobros.schema'



@Injectable()
export class Pagos_EstadisticaService 
{
	private readonly logger:Logger
	private _Response:responseInterface
	private _SystemResponse:responseInterface
	private ClustertraceDB:Array<TrazaPagoSystema>
	private t_Enrutator:number
	private ClusterEnrutators:Array<any> //cluster para guardar a los enrutadores
	private paymentTrace:PaymentTrace


	constructor
	(
		private readonly _statService:EstadisticaService,
		@InjectModel(TrazaPagoSystema.name) private _trazaPagoModel:Model<TrazaPagoSystema>
	)
	{
		this.logger = new Logger("Estadisticas de cobros") 
		this.logger.setContext("Estadisticas de cobros")
		this.paymentTrace =
		{
			enrutador_id		:"", //id del enrutador
			cobrador_id_low 	:"", //id del cobrador con el cobro mas bajo
			cobrador_id_high	:"", //id del cobrador con el cobro mas alto
			pbussines_id_low    :"", //id del negocio con el cobro mas bajo
			pbussines_id_high	:"", //id del negocio con el cobro mas alto 
			payment_low			:0,  //monto del cobro mas bajo
			payment_high		:0,  //monto del cobro mas alto
			payment_count		:0   //cantidad de cobros realizados en un dia
		}
	}
	//--------funciones publicas de usuario-------------
	public async getStatsPaymentByEnrutator(id:string):Promise<responseInterface>
	{//funcion que me retorno la traza del dia
		this._Response = await this.getStatsPaymentsByEnrutatorInSystem(id, 0)

		return this._Response
	}

	public async getTraceBussinesByEnrutator(id:string):Promise<responseInterface>
	{//funcion que retorna el historico de negocios tabajados por un enrutador
		const args: _argsFind = 
        {
            findObject: {enrutador_id: id}  
        }
		this._Response = await this._statService.getDataBySystem(this._trazaPagoModel, args)

		return this._Response
	}

	//--------funciones privadas de sistema-------------
	private async getStatsPaymentsByEnrutatorInSystem(id:string, days:number):Promise<responseInterface>
	{//funcion que me retorna estadistica de cobros basado en el enrutador
		let aux:Cobros
		this._SystemResponse = await this._statService.getPaymentsBySystemUsingIdEnrutator(id, days)
		this.paymentTrace.enrutador_id = id.toString()

		if(this._SystemResponse.ok)
		{   //primero buscaré los valores altos para mostrar
			aux = this.getLowerOrHigherModel(this._SystemResponse.data.payments, 1)
			//empiezo a llenar la traza para mostrar
			this.paymentTrace.pbussines_id_high  = aux.negocio_id.toString()
			this.paymentTrace.cobrador_id_high   = aux.cobrador_id.toString()
			this.paymentTrace.payment_high     	 = aux.monto
			
			//ahora busco los valores mas bajos
			aux = this.getLowerOrHigherModel(this._SystemResponse.data.payments, 2)
			//empiezo a llenar la traza para mostrar
			this.paymentTrace.pbussines_id_low   = aux.negocio_id.toString()
			this.paymentTrace.cobrador_id_low  	 = aux.cobrador_id.toString()
			this.paymentTrace.payment_low     	 = aux.monto
			this.paymentTrace.payment_count   	 = this._SystemResponse.data.payments.length

			this._SystemResponse.data = this.paymentTrace //concluyo y reescribo la respuesta
		}else
		{
			this._SystemResponse.data = []
			this._SystemResponse.message = 'No se encontró ningún pago registrado con este enrutador hoy...'
			this._SystemResponse.ok = false
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
				func = (prev, current)=> (prev.monto > current.monto)? prev : current
			break;

			case 2:
				func = (prev, current)=> (prev.monto < current.monto)? prev : current
			break;

			default: return 
		}

		return dataCluster.reduce(func)//le paso la funcion establecida al cluster para evaluar y retorno el resultado...
	}

	private async generateTrace()
	{//funcion que genera la traza paa guardarle en base

		if(this.ClusterEnrutators.length > 0)
		{
			for(let i:number =0; i <this.t_Enrutator; i++)
			{
				await this.getStatsPaymentsByEnrutatorInSystem(this.ClusterEnrutators[i]._id.toString(), -1);
				(this._SystemResponse.ok)? await this.ClustertraceDB.push(new this._trazaPagoModel(this.paymentTrace)) : false;
			}

		}else
		{
			this.logger.debug('   No existen enrutadores en estos momentos..., saltando procedimiento...')
		}
	}
	
	private async saveClusterTracePayment()
	{//Guardo en base de datos la traza generada de negocios por cada enrutador
		if (this.ClustertraceDB.length  > 0) 
		{
			for(let i:number =0; i <this.t_Enrutator; i++)
			{
				this._SystemResponse = await this._statService.saveDataBySystem(this.ClustertraceDB[i])
				
			}

		}else
		{
			this.logger.debug('   No existen cobros en estos momentos..., saltando procedimiento...')
		}
	}

	//--------funciones públicas de sistema-------------
	public async generateTraceStatsPayment(dataCluster:Array<any>, t_Enrutators:number, debug:boolean =false)
	{
		this.logger.debug('  9)Generando estadisticas de cobros/negocios...')
		this.ClusterEnrutators = new Array<any>()
		this.ClustertraceDB    = new Array<TrazaPagoSystema>()
		this.ClusterEnrutators = dataCluster
		this.t_Enrutator 	   = t_Enrutators
		await this.generateTrace()

		if(debug)
		{
			this.logger.debug(' ESTADISTICAS DE NEGOCIOS/PAGOS EN MODO DEBUG, NO GUARDA DATOS EN BASE...')
			console.log("RUTA AL CONTROLADOR server/cobros/stats/:enrutador :\n", await this.getStatsPaymentByEnrutator('5f9a8465a39bda0c1c5b971a'));
			console.log("CANTIDAD DE ENRUTADORES en pagos:", this.t_Enrutator,'\n')
			//console.log("\nCLUSTER DE ENRUTADORES en pagos:\n", this.ClusterEnrutators)
			console.log("\nCLUSTER DE TRAZA DE PAGOS/NEGOCIO:\n", this.ClustertraceDB)
		
		}else
		{
			this.logger.debug('  10)Guardando para histórico de estadisticas de pagos/negocios...')
			await this.saveClusterTracePayment() //guardo uno x uno por enrutador las trazas de pagos
		}

		//finalizo ambos clusters hasta la siguiente traza
		this.logger.debug('  11)Finalizando clusters de estadisticas de pagos/negocios...')
		this.ClusterEnrutators = null
		this.ClustertraceDB    = null
		this.t_Enrutator 	   = null
	}
}
