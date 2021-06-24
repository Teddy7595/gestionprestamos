import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EstadisticaService } from './estadistica.service'
import { DateProcessService } from 'src/Classes/classes.index'
import 
{ 
	responseInterface, 
	_argsFind, 
	_argsPagination, 
	_argsUpdate, 
	_configPaginator, 
	_dataPaginator 
} from 'src/Response/interfaces/interfaces.index'
import { CajaChica, GastosOperacion } from 'src/Modules/nomina/models/schemas/cajachica.schema'
import { TrazaCajaCHSystema } from 'src/Modules/estadistica/models/schemas/cajachica.estadistica.schema'
import { pettycashTrace } from '../models/interfaces/index.interface'

@Injectable()
export class Cajachica_EstadisticaService 
{
	private _SystemResponse:responseInterface
	private _Response:responseInterface
	private logger:Logger
	private t_Enrutator:number
	private ClusterPettyCash:Array<CajaChica>
	private ClustertraceDB:Array<any>
	private ClusterEnrutators:Array<any>
	private pettyCashTrace:pettycashTrace
	private day:string

	constructor
	(
		//@InjectModel(CajaChica.name) private readonly _cajaCHModel:Model<CajaChica>,
		private readonly _statService:EstadisticaService,
		private readonly _dateProcess:DateProcessService,
		@InjectModel(TrazaCajaCHSystema.name) private _traceCajaCHModel:Model<TrazaCajaCHSystema>
	)
	{
		this.logger = new Logger()
		this.logger.setContext('Estadisticas de caja chica')
		this.pettyCashTrace =
		{
			enrutador_id	 : '',//id del enrutador
			cajaCH_low_id	 : '',//id de la caja chica con menos monto asignado
			cajaCH_high_id	 : '',//id de la caja chica con mas monto asignado
			nro_cajaCH		 : 0,//numero de cajas chicas totales que maneja el enrutador 
			gastosOp     	 : [{}],//valor del costo de op mas alto hasta la fecha
			cajaCH_high 	 : 0,//valor de la caja chica con mas monto asignado
			cajaCH_low 		 : 0,//valor de la caja chica con menos monto asignado
		}
		this.day = this._dateProcess.getNextPointInTime(-1)
	}

	//------funciones publicas de usuario-------
	/**
		Funcion que trae los datos del dia acerca de las rutas
	*/
	public async getStatsPettyCashByEnrutator(id:string):Promise<responseInterface>
	{//funcion que me retorno la traza del dia
		this._Response = await this.getStatsPettyCashByEnrutatorInSystem(id)

		return this._Response
	}

	/**
		Funcion que retorna la data guardada en base a través del ID del enrutador
		todas las funciones que tienen el getDataBySystem, traen la data sin usar 
		paginador, si se desea modificr e implementar el paginador, solo debe cambiar
		a la funcion getDataBySystemWithPaginator para implementar el paginador
	*/
	public async getTracePettyCashByEnrutator(id:string):Promise<responseInterface>
	{
		const args: _argsFind = 
        {
            findObject: {enrutador_id: id}  
        }
		this._Response = await this._statService.getDataBySystem(this._traceCajaCHModel, args)

		return this._Response
	}

	//------funciones privadas de sistema-------
	/**
		Funcion que me aporta las estadisticas por enrutador dento del sistema
	*/
	private async getStatsPettyCashByEnrutatorInSystem(id:string):Promise<responseInterface>
	{
		this._SystemResponse = await this._statService.getPettyCashByEnrutatorsToOtherService(id)
		this.pettyCashTrace.enrutador_id = id
		this.pettyCashTrace.nro_cajaCH   = this._SystemResponse.data.length

		if (this._SystemResponse.ok) 
		{
			//tomando valores bajos
			this.pettyCashTrace.cajaCH_low     = this.getLowerOrHigherModel(this._SystemResponse.data, 'lowerMountPC')
			this.pettyCashTrace.cajaCH_low_id  = (this.getLowerOrHigherModel(this._SystemResponse.data, 'idLowerMountPC')).toString()

			//tomando valores altos
			this.pettyCashTrace.cajaCH_high     = this.getLowerOrHigherModel(this._SystemResponse.data, 'higherMountPC')
			this.pettyCashTrace.cajaCH_high_id  = (this.getLowerOrHigherModel(this._SystemResponse.data, 'idHigherMountPC')).toString()

			//tomando valores de gastos de operaciones
			this.pettyCashTrace.gastosOp = await this.getGastosOP(this._SystemResponse.data, 'gastosOP')

			//concluyendo data
			this._SystemResponse.data = this.pettyCashTrace
		}else
		{
			this._SystemResponse.data = []
		}

		return this._SystemResponse
	}


	/**
		Funcion que se dedica a sacar los datos de los gastos de operacion y generar
		un historial de dichas gastos generados el día anterior
	*/
	private async getGastosOP(dataCluster:Array<any>, type:string):Promise<any>
	{
		let aux:Array<any> = Array<any>()
		this.day = this._dateProcess.getNextPointInTime(-1)

		const func:object =
		{
			gastosOP: (current:CajaChica, index:number) =>
			{
				current.gasto.forEach((data:GastosOperacion, index:number)=>
				{
					const auxOBJ:object =
					{
						'idCaja':     current._id,      //id de la caja donde se refleja el gasto
						'idCobrador': current.cobrador, //id del cobrador dueño de la caja chicha
						'monto':      data.monto,       //monto del gasto de operaciones
						'nro':	      (index +1),       //numero del registro en el array de gastos
						'motivo':     data.desc,        //motivo del gasto
						'date':       data.createdAt    //fecha cuando fue realizada la operacion
					};

					(data.createdAt[1] == this.day)? aux.push(auxOBJ) /*console.log(auxOBJ) */: false;
				})

				return aux
			}
		}

		await dataCluster.forEach(func[type])

		return aux
	}

	/**
		Funcion filtra los datos dependiendo de las necesidades
	*/
	private getLowerOrHigherModel(dataCluster:Array<any>, type:string)
	{

		/*
			Tomo un objeto que le asigno funciones y dependiendo del llamdo
			de la función principal a traves de type, pido la funcion que
			necesito dependiendo del momento, si son los ids o lso valores
			de menor o mayor valor dentro del cluster
		*/
		const func:object =
		{
			higherMountPC: 	(prev:CajaChica, current:CajaChica)=>
						   	(prev.monto > current.monto)? prev.monto : current.monto,

			idHigherMountPC:(prev:CajaChica, current:CajaChica)=>
						   	(prev.monto > current.monto)? prev._id : current._id,

			lowerMountPC: 	(prev:CajaChica, current:CajaChica)=>
						   	(prev.monto < current.monto)? prev.monto : current.monto,

			idLowerMountPC: (prev:CajaChica, current:CajaChica)=>
						   	(prev.monto < current.monto)? prev._id : current._id,
		}

		return dataCluster.reduce(func[type])
	}

	/**
		Funcion que genera los datos de todos los enrutadores y los guarda en el cluster temporal
	*/
	private async generateTrace()
	{
		if(this.ClusterEnrutators.length > 0)
		{
			for(let i:number =0; i <this.t_Enrutator; i++)
			{
				await this.getStatsPettyCashByEnrutatorInSystem(this.ClusterEnrutators[i]._id.toString());
				(this._SystemResponse.ok)? await this.ClustertraceDB.push(new this._traceCajaCHModel(this.pettyCashTrace)) : false;
			}

		}else
		{
			this.logger.debug('   No existen enrutadores en estos momentos...176, saltando procedimiento...')
		}
	}

	/**
		Funcion que se encarga de almacenar en base de datos lo generado en el cluster temproal
	*/
	private async saveClusterPettyCash()
	{//funcion que genera la traza paa guardarle en base

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

	//------funciones publicas de sistema-------
	/**
		Funcion publica para ser invocada por el handler.stats.service
	*/
	public async generateTraceStatsPettyCash(dataCluster:Array<any>, t_Enrutators:number, debug:boolean =false)
	{
		this.logger.debug('  14)Generando estadisticas de caja chica...')
		this.ClustertraceDB    = new Array<any>()
		this.ClusterEnrutators = dataCluster
		this.t_Enrutator 	   = t_Enrutators
		await this.generateTrace()

		if (debug) 
		{
			this.logger.debug(' ESTADISTICAS DE CAJAS CHICAS EN MODO DEBUG, NO GUARDA DATOS EN BASE...')
			console.log("\nCAJAS CHICAS MANEJADAS POR UN ENRUTADOR:", await this.getStatsPettyCashByEnrutatorInSystem('5f9a8465a39bda0c1c5b971a'))
			console.log("\nCLUSTER CAJAS CHICAS:\n", this.ClustertraceDB)
		}else
		{
			this.logger.debug('  15)Guardando para histórico de estadisticas de caja chicha...')
		 	await this.saveClusterPettyCash()
		}

		this.ClustertraceDB    = null
		this.ClusterEnrutators = null
		this.t_Enrutator 	   = null
	}
}
