import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DateProcessService, ProcessDataService } from 'src/Classes/classes.index'
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
import { Negocio } from 'src/Modules/clientes/models/schemas/negocio.schema'
import { Cobros } from 'src/Modules/clientes/models/schemas/cobros.schema'
import { Cliente } from 'src/Modules/clientes/models/schemas/cliente.schema'
import { Users } from 'src/Modules/users/models/schemas/userSchema' 
import { Nomina } from 'src/Modules/nomina/models/schemas/nomina.schema'
import { CajaChica } from 'src/Modules/nomina/models/schemas/cajachica.schema'
import { TrazaEstadisticaSystema } from 'src/Modules/estadistica/models/schemas/traza.estadistica.schema'


/* TODO:
	*numero de rutas, ->listo para admin y enrtador
	*numero total de negocios -> listo para admin y enrutador
	*numero total de clientes ->listo para admin y enrutador
	*numero total de cobradores -> listo para admin y enrutador
	*numero total de cajas chichas -> listo para admin y enrutador
	*numero total de nominas -> listo para admin y enrutador
	*guardar las trazas totales en base de datos, para ruta admin -> listo
*/

/*
 	*primero debemos obtener todos los schemas de cada ambito al cual le aplicaremos las estadisticas
 	*será una operación bastante pesada solo si se toma por dia y dichos calculos se guardan en un modelo
 	*para esto necesitaria el modelo de cliente, negocios, rutas, usuarios,cobros
 	*todas las peticiones se harán tomando en cuenta el ID del enrutador
 */

@Injectable()
export class EstadisticaService 
{
	private readonly logger:	Logger //log del CRON
	//private readonly roles:		number //cantidad de pasadas de revisión según la cantidad de roles
	private _Response:			responseInterface //variable de respuesta de backend
	private AuxUser:			Array<Users> //auxiliar de modelo usuarios
	private _SystemResponse:	responseInterface //interfaz de respuesta para sistema
	private ClusterCliente:		Array<Cliente> 	//array de clientes 
	private ClusterNegocios:	Array<Negocio> 	//array de negocios
	private ClusterRutas:		Array<Ruta> 	//array de rutas
	private ClusterCobradores:	Array<any> 		//array de cobradores
	private ClusterEnrutadores:	Array<any> 		//array de enrutdores
	private ClusterUsers:		Array<any> 		//array de usuarios
	private ClusterCobros:		Array<Cobros>  	//array de cobros
	private ClusterNomina:		Array<Nomina>	//array de nominas
	private ClusterCajaCh:		Array<CajaChica>//array de cajas chichas

	constructor
	(
        private readonly _processData:ProcessDataService,
        private readonly _dateProcessService:DateProcessService,
        @InjectModel(Ruta.name) private readonly _rutaModel:Model<Ruta>,
        @InjectModel(Negocio.name) private readonly _negocioModel:Model<Negocio>,
        @InjectModel(Cliente.name) private readonly _clienteModel:Model<Cliente>,
		@InjectModel(Users.name) private readonly _usuariosModel:Model<Users>, 
		@InjectModel(Cobros.name) private readonly _cobrosModel:Model<Cobros>,
		@InjectModel(CajaChica.name) private readonly _cajachModel:Model<CajaChica>,
		@InjectModel(Nomina.name) private readonly _nominahModel:Model<Nomina>,
		@InjectModel(CajaChica.name) private readonly _pettyCashModel:Model<CajaChica>,
		@InjectModel(TrazaEstadisticaSystema.name) private _trazaModel:Model<TrazaEstadisticaSystema>
    )
	{
		this.logger = new Logger("Estadisticas") 
		this.logger.setContext("Sistema de Estadisticas")
		
		//this.roles = 2;//seteo la cantidad de roles que limpiaré dentro del bucle de depurado
	}

    //---------- funciones publicas de usuario-------------

    public async getTraceSystemStatsByAdmin():Promise<responseInterface>
    {//funcion administrativa que retorna la traza de la cantidad de modelo 
     //presentes en el sistema con paginador

    	const parameters: _dataPaginator =
        {
            page: 1 || _configPaginator.page,
            limit: 12 || _configPaginator.limit,
            customLabels: _configPaginator.customLabels,
            sort: { _id: -1 },
        }

        const args: _argsPagination =
        {
            findObject: {},
            options: parameters
        }

        await this.getDataBySystemWithPaginator(this._trazaModel,args)

        this._Response = this._SystemResponse
    	return this._Response
    }

	public async getAllSystemResumeByAdmin():Promise<responseInterface>
	{//funcion de admin que le permite ver la cantidad de datos totales registrados en el sistema

		this.ClusterInitialization();//inicializo los clusters
		await this.getAllUserBySystem()  //me jalo a todos los usuarios registrados
		await this.purifyRolesInCluster() //purifico los cluster con la data del mdoelo users
		await this.getAllClientsBySystem() //me jalo todos los clientes registrados en el sistema
		await this.getAllRouteBySystem() //me jalo a todos los datos de rutas
		await this.getAllBussinesBySystem() //me jalo toda la data respectiva de necogios
		await this.getAllPaymentBySystem() //me jalo todos los cobros dentro del sistema

		const stats:object =
		{
			'users':     	this.ClusterUsers.length, 
			'rutas':     	this.ClusterRutas.length,  
			'cobros':    	this.ClusterCobros.length,
			'nomina':    	this.ClusterNomina.length, 
			'clientes':  	this.ClusterCliente.length,
			'caja_chica':	this.ClusterCajaCh.length, 
			'negocios':	 	this.ClusterNegocios.length, 
			'cobradores':	this.ClusterCobradores.length, 
			'enrutdores':	this.ClusterEnrutadores.length
		}

		this._Response = this._SystemResponse
		this._Response.data = stats
		this.ClusterWipe()//finalizo los clusters

		return this._Response
	}

	public async countRoutesByEnrutator(id:string):Promise<responseInterface>
	{//funcion que le cuenta cuantas rutas tiene a dispocion el enrutador
		await this.getRoutesByEnrutator(id)

		this._Response = this._SystemResponse
		this._Response.data = this._SystemResponse.data.length
		return this._Response;
	}

	public async countCollectorByEnrutator(id:string):Promise<responseInterface>
	{//funcion que le cuenta al momento cuantos cobradores tiene a dispodicion el enrutador
		await this.getCollectorsByEnrutator(id)

		this._Response = this._SystemResponse
		this._Response.data = this._SystemResponse.data.length
		return this._Response; 
	}

	public async countClientByEnrutator(id:string):Promise<responseInterface>
	{//funcion que cuenta la cantidad de clientes que pertecen al enrutador
		await this.getClientsByEnrutator(id)

		this._Response = this._SystemResponse
		this._Response.data = this._SystemResponse.data.length
		return this._Response
	}

	public async countBussinesByEnrutator(id:string):Promise<responseInterface>
	{//funcion que cuenta la cantidad de negocios a cargo de un enrutador
		await this.countBussinesBySystem(id)

		if(!this._SystemResponse.data || this._SystemResponse.data.length <= 0)
		{
			this._Response.data    = 0
			this._Response.status  = 202
			this._Response.message = "No se encontró negocios asignados a este enrutador"
			this._Response.ok 	   = true

		}else{ this._Response = this._SystemResponse }

		return this._Response
	}

	public async countPayRollsByEnrutator(id:string):Promise<responseInterface>
	{//funcion que cuenta la cantidad de clientes que pertecen al enrutador
		await this.getAllPayRollsByEnrutator(id)

		this._Response = this._SystemResponse
		this._Response.data = this._SystemResponse.data.length
		return this._Response
	}

	public async countPettyCashByEnrutator(id:string):Promise<responseInterface>
	{//funcion que cuenta la cantidad de cajas chichas que pertecen al enrutador
		await this.getAllPettyCashByEnrutator(id)

		this._Response = this._SystemResponse
		this._Response.data = this._SystemResponse.data.length
		return this._Response
	}

	//---------- funciones privadas de sistema-------------

	private ClusterInitialization()
	{//funcion que inicializa los cluster para poder almacenar datos
		this.ClusterCliente 	= new Array<Cliente>() 	//array de clientes 
		this.ClusterNegocios 	= new Array<Negocio>() 	//array de negocios
		this.ClusterRutas 		= new Array<Ruta>() 	//array de rutas
		this.ClusterCobradores 	= new Array<any>() 		//array de cobradores
		this.ClusterEnrutadores = new Array<any>() 		//array de enrutdores
		this.ClusterUsers 		= new Array<any>() 		//array de usuarios
	    this.ClusterCobros		= new Array<Cobros>()  	//array de cobros
	    this.ClusterNomina		= new Array<Nomina>()  	//array de nominas
	    this.ClusterCajaCh	    = new Array<CajaChica>()//array de cajas chichas
	}

	private ClusterWipe()
	{//funcion que limpia los arrays al finalizar el procedimiento
        this.ClusterCliente 	= null//array de clientes 
		this.ClusterNegocios 	= null//array de negocios
		this.ClusterRutas 		= null//array de rutas
		this.ClusterCobradores 	= null//array de cobradores
		this.ClusterEnrutadores = null//array de enrutdores
		this.ClusterUsers 		= null//array de usuarios
		this.ClusterCobros		= null//array de cobros
	    this.ClusterNomina		= null//array de nominas
	    this.ClusterCajaCh	    = null//array de cajas chichas
	}

	private async saveTraceSystemInDataBase():Promise<responseInterface>
	{//funcion que guarda cada cluster en la base de datos
		const trazaSystema:TrazaEstadisticaSystema = new this._trazaModel({
			'rutas': 		this.ClusterRutas.length,
			'negocios':		this.ClusterNegocios.length,
			'enrutadores':	this.ClusterEnrutadores.length,
			'clientes':		this.ClusterCliente.length,
			'cobradores':   this.ClusterCobradores.length,
			'cobros':		this.ClusterCobros.length,
			'nomina':		this.ClusterNomina.length,
			'usuarios':		this.ClusterUsers.length,
			'caja_ch':		this.ClusterCajaCh.length
		})

		await this.saveDataBySystem(trazaSystema)
		return this._SystemResponse
	}

	private async getAllPettyCashByEnrutator(id:string):Promise<responseInterface>
	{//funcion que me retorna todos las cajas chichas al mando de un enrutador
		const args:_argsFind=
		{
			findObject:{enrutador:id}
		}

		await this.getDataBySystem(this._cajachModel,args);
        (this._SystemResponse.data.length > 0)? this._SystemResponse.ok = true : this._SystemResponse.ok = false
		return this._SystemResponse
	}

	private async getAllPayRollsByEnrutator(id:string):Promise<responseInterface>
	{//funcion que me retorna todos las nominas al mando de un enrutador
		const args:_argsFind=
		{
			findObject:{enrutador:id}
		}

		await this.getDataBySystem(this._nominahModel,args);
        (this._SystemResponse.data.length > 0)? this._SystemResponse.ok = true : this._SystemResponse.ok = false
		return this._SystemResponse
	}

	private async getClientsByEnrutator(id:string):Promise<responseInterface>
	{//funcion que me retorna todos las clientes al mando de un enrutador
		const args:_argsFind=
		{
			findObject:{enrutador_id:id}
		}

		await this.getDataBySystem(this._clienteModel,args);
        (this._SystemResponse.data.length > 0)? this._SystemResponse.ok = true : this._SystemResponse.ok = false
		return this._SystemResponse
	}

	private async getRoutesByEnrutator(id:string):Promise<responseInterface>
	{//funcion que me retorna todos las rutas al mando de un enrutador
		const args:_argsFind=
		{
			findObject:{enrutador_id:id}
		}

		await this.getDataBySystem(this._rutaModel,args);
		(this._SystemResponse.data.length >0)? this._SystemResponse.ok = true : this._SystemResponse.ok = false
		return this._SystemResponse
	}

	private async getCollectorsByEnrutator(id:string):Promise<responseInterface>
	{//funcion que me retorna todos los cobradores al mando de un enrutador
		const args:_argsFind =
		{ 
			findObject:{enrutator_id:id}
		}

		await this.getDataBySystem(this._usuariosModel,args);
        (this._SystemResponse.data.length > 0)? this._SystemResponse.ok = true : this._SystemResponse.ok = false
		return this._SystemResponse
	}

	private async getBussinesByCollector(id:string):Promise<responseInterface>
	{//función que le cuenta al momento cuantos negocios tiene a su disposición el cobrador
		const args:_argsFind =
		{
			findObject:{cobrador_id:id}
		}

        await this.getDataBySystem(this._negocioModel,args)
		return this._SystemResponse
	}

	private async getPaymentsByCollector(id:string):Promise<responseInterface>
	{//función que le cuenta al momento cuantos negocios tiene a su disposición el cobrador
		const args:_argsFind =
		{
			findObject:{cobrador_id:id}
		}

        await this.getDataBySystem(this._cobrosModel,args);
        (this._SystemResponse.data.length > 0)? this._SystemResponse.ok = true : this._SystemResponse.ok = false
		return this._SystemResponse
	}

	private async getPettyCashByCollector(id:string):Promise<responseInterface>
	{//función que le cuenta al momento cuantos negocios tiene a su disposición el cobrador
		const args:_argsFind =
		{
			findObject:{enrutador:id}
		}

        await this.getDataBySystem(this._pettyCashModel,args);
        (this._SystemResponse.data.length > 0)? this._SystemResponse.ok = true : this._SystemResponse.ok = false
		return this._SystemResponse
	}

	private purifyRolesInCluster()
	{//función que extrae los elementos del cluster de ususrio según el tipo
		
		for (let i: number = 0; i < this.ClusterUsers.length; i++) 
		{
			let role: any = this.ClusterUsers[i].rol;

			(role.rol === 'COLLECTOR_ROLE') ? this.ClusterCobradores.push(this.ClusterUsers[i]) : false;

			(role.rol === 'ENRUTATOR_ROLE') ? this.ClusterEnrutadores.push(this.ClusterUsers[i]) : false;

			(role.rol === 'ADMINOR_ROLE') ? true : false;//roles pendiente por funcionalidades futuras

			(role.rol === 'DEFAULT_ROLE') ? true : false;//roles pendiente por funcionalidades futuras
		}
	}

	//-------------funciones privadas de sistem, llenado de clusters----------------

	private async getAllPayRollBySystem()
	{//funcio que me retorna todas los cobros registrados en el sistema
		this.ClusterNomina = await (await this.getDataBySystem(this._nominahModel)).data
	}

	private async getAllPettyCashBySystem()
	{//funcio que me retorna todas los cobros registrados en el sistema
		this.ClusterCajaCh = await (await this.getDataBySystem(this._cajachModel)).data
	}

	private async getAllPaymentBySystem():Promise<Array<Cobros>>
	{//funcio que me retorna todas los cobros registrados en el sistema
		this.ClusterCobros = await (await this.getDataBySystem(this._cobrosModel)).data

		return this.ClusterCobros
	}

	private async getAllRouteBySystem()
	{//funcio que me retorna todas las rutas registrados en el sistema
		this.ClusterRutas = await (await this.getDataBySystem(this._rutaModel)).data
	}

	private async getAllUserBySystem()
    {//funcion dedicada a obtener todas las rutas registrados en el sistema
    	const args: _argsFind = 
        {
            findObject: {},
            populate: 
            { 
            	path:'rol', 
            	model:'Roles',
            	select:'rol' 
            }   
        }

        this.ClusterUsers = await (await this.getDataBySystem(this._usuariosModel,args)).data
    }

	private async getAllBussinesBySystem()
	{//funcion dedicada a obtener toos los datos de negocios registrados en el sistema

		this.ClusterNegocios = await (await this.getDataBySystem(this._negocioModel)).data
	}

	private async getAllClientsBySystem()
	{//funcion de dedicada a obtner los datos de clientes registrados en el sistema

		this.ClusterCliente = await (await this.getDataBySystem(this._clienteModel)).data
	} 

	private async getTotalEnrutatorsBySystem():Promise<number>
	{//funcion que me permite saber el numero de enrutadores a los servicios dedicados 
		let aux:number = 0

		this.ClusterInitialization()
		await this.getAllUserBySystem()
		this.purifyRolesInCluster()
		aux = this.ClusterEnrutadores.length
		this.ClusterWipe()
		return aux
	}

	//---------- funciones publicas de sistema-------------
	public async getCollectorsByEnrutetorToOtherService(id:string):Promise<responseInterface>
	{
		return await this.getCollectorsByEnrutator(id)
	}

	public async getTotalEnrutatorsToOtherService():Promise<number>
	{//funcion que me permite trasladar el numero de enrutadores a los servicios dedicados 
		return await this.getTotalEnrutatorsBySystem() || 0
	}

	public async getTotalRoutesByEnrutatorsToOtherService(id:string):Promise<number>
	{//funcion que me permite trasladar el numero de rutas a los servicios dedicados 
		return await (await this.countRoutesByEnrutator(id)).data || 0
	}

	public async getRoutesByEnrutatorsToOtherService(id:string):Promise<responseInterface>
	{//funcion que me permite trasladar las rutas de enrutadores a los servicios dedicados 
		return await this.getRoutesByEnrutator(id)
	}

	public async getPettyCashByEnrutatorsToOtherService(id:string):Promise<responseInterface>
	{//funcion que me permite trasladar las rutas de enrutadores a los servicios dedicados 
		return await this.getPettyCashByCollector(id)
	}

	public async getEnrutatorsToOtherService():Promise<Array<Users>>
	{//funcion que me permite trasladar el cluster de enrutadores a los servicios dedicados 
		let aux:Array<Users> = new Array<Users>()

		this.ClusterInitialization()
		await this.getAllUserBySystem()
		this.purifyRolesInCluster()
		aux = this.ClusterEnrutadores
		this.ClusterWipe()

		return aux
	}

	public async getCollectorsToOtherService():Promise<Array<Users>>
	{//funcion que me permite trasladar el cluster de cobradores a los servicios dedicados 
		let aux:Array<Users> = new Array<Users>()

		this.ClusterInitialization()
		await this.getAllUserBySystem()
		this.purifyRolesInCluster()
		aux = this.ClusterCobradores
		this.ClusterWipe()

		return aux
	}

	public async getBussinesToOtherService():Promise<Array<Negocio>>
	{//funcion que me permite trasladar el cluster de negocios a los servicios dedicados 
		let aux:Array<Negocio> = new Array<Negocio>()

		this.ClusterInitialization()
		await this.getAllBussinesBySystem()
		aux = this.ClusterNegocios
		this.ClusterWipe()

		return aux
	}

	public async getClientsToOtherService():Promise<Array<Cliente>>
	{//funcion que me permite trasladar el cluster de clientes a los servicios dedicados 
		let aux:Array<Cliente> = new Array<Cliente>()

		this.ClusterInitialization()
		await this.getAllClientsBySystem()
		aux = this.ClusterCliente
		this.ClusterWipe()

		return aux
	}

	public async getRoutesToOtherService():Promise<Array<Ruta>>
	{//funcion que me permite trasladar el cluster de clientes a los servicios dedicados 
		let aux:Array<Ruta> = new Array<Ruta>()

		this.ClusterInitialization()
		await this.getAllRouteBySystem()
		aux = this.ClusterRutas
		this.ClusterWipe()

		return aux
	}

	public async systemStats(debug:boolean =false)
	{//funcion que genera los protocolos de estadisticas generales de sistema
		this.logger.debug('Protocolo de estadisticas:')
		this.logger.debug(' 1)Inicilizando variables cluster...')
		this.ClusterInitialization()//aqui inicializo los arrays
		this.logger.debug(' 2)Obteniendo los datos de los modelos...')
		await this.getAllUserBySystem()  //me jalo a todos los usuarios registrados
		await this.purifyRolesInCluster() //purifico los cluster con la data del mdoelo users
		await this.getAllClientsBySystem() //me jalo todos los clientes registrados en el sistema
		await this.getAllRouteBySystem() //me jalo a todos los datos de rutas
		await this.getAllBussinesBySystem() //me jalo toda la data respectiva de necogios
		await this.getAllPaymentBySystem() //me jalo todos los cobros dentro del sistema
		await this.getAllPayRollBySystem() //me jalo todas las nominas dentro del sistema
		await this.getAllPettyCashBySystem() //me jalo todas los cajas chicas dentro del sistema
		this.logger.debug(' 3)Limpiando y contabilizando datos de los modelos en el sistema...')
		this.logger.debug(`   *Cantidad total de Users: ${this.ClusterUsers.length}`)
		this.logger.debug(`   *Cantidad total de Rutas: ${this.ClusterRutas.length}`)
		this.logger.debug(`   *Cantidad total de Cobros: ${this.ClusterCobros.length}`)
		this.logger.debug(`   *Cantidad total de Nomina: ${this.ClusterNomina.length}`)
		this.logger.debug(`   *Cantidad total de Clientes: ${this.ClusterCliente.length}`)
		this.logger.debug(`   *Cantidad total de Caja chica: ${this.ClusterCajaCh.length}`)
		this.logger.debug(`   *Cantidad total de Negocios: ${this.ClusterNegocios.length}`)
		this.logger.debug(`   *Cantidad total de Cobradores: ${this.ClusterCobradores.length}`)
		this.logger.debug(`   *Cantidad total de Enrutadores: ${this.ClusterEnrutadores.length}`);
		if(debug)
		{
			this.logger.debug(' ESTADISTICAS DE SISTEMA EN MODO DEBUG, NO GUARDA DATOS EN BASE...')
			//this.logger.debug(await this.countBussinesByEnrutator('5f9a8465a39bda0c1c5b971a'))
		}else
		{
			await this.saveTraceSystemInDataBase() //guardo la traza de los datos recolectados anteriormente
			this.logger.debug(` 4)Guardando datos para histórico en la base de datos... ${this._SystemResponse.ok}`)
		}
		this.logger.debug(' 5)Limpiando y finalizando clusters...')
		await this.ClusterWipe()//llamo a la funcion para finalizar los arrays
	}

	public async getBussinesBySystemUsingIdEnrutator(id:string):Promise<responseInterface>
	{
		let UserArrayAux:Array<Users> 		= new Array<Users>()//creo una variable auxiliar para manejar los _id
		let BussinesArrayAux:Array<Negocio> = new Array<Negocio>()//creo una variable auxiliar para manejar los negocios
		let countBussinesByEnrutator:number = 0//creo una variable auxiliar que cuente la cantidad de negocios
		//primero saco todos los cobrador que hayan sido referenciados por el enrutador de parametro
		await this.getCollectorsByEnrutator(id);
		//compruebo que la respuesta del sistema contenga datos
		UserArrayAux = this._SystemResponse.data; //libero la respuesta del sistema para la nueva busqueda
		//por cada id buscaré los negocios asignados a esos _id de cobradores y luego los contaré
		//el resultado final será la cantidad de nogecios totales que meneja el enrutador
		this._SystemResponse.ok = false //en el caso de que no exista ningun negocio registrado con un enrutador
		for (let i:number = 0; i < UserArrayAux.length; ++i) 
		{//saco la información correspondiente
			BussinesArrayAux = await(await this.getBussinesByCollector(UserArrayAux[i]._id)).data
			//cuanto la cantidad de ngocios, repito el ciclo por cada _id referenciado del enrutador
			countBussinesByEnrutator += BussinesArrayAux.length
			this._SystemResponse.ok = true
		}
		this._SystemResponse.data = {'total_bussines': countBussinesByEnrutator, 'bussines': BussinesArrayAux}

		return this._SystemResponse
	}

	public async getPaymentsBySystemUsingIdEnrutator(id:string, days:number):Promise<responseInterface>
	{
		let CollectorsArrayAux:Array<Users>    = await(await this.getCollectorsByEnrutator(id)).data
		let countPaymentsByEnrutator:number    = 0//creo una variable auxiliar que cuente la cantidad de negocios
		let auxClusterPayments:Array<Cobros>   = await this.getAllPaymentBySystem() //me jalo todos los cobros
		let resultClusterPayment:Array<Cobros> = Array<Cobros>() //una variable axuliar que retorna el resultado de la depuracion
		let dateTopay:string 				   = this._dateProcessService.getNextPointInTime(days)//seteo los pagos del dia anterior
		this._SystemResponse.ok                = false // mientras que no se entre al bucle de filtrado a operacion será fallida

		for(let i:number =0; i < CollectorsArrayAux.length; i++)
		{
			for(let j:number =0; j < auxClusterPayments.length; j++)
			{
				if
				( 
					(auxClusterPayments[j].cobrador_id.toString() == CollectorsArrayAux[i]._id.toString()) //busco por cobrador
					&& 	(auxClusterPayments[j].createdAt[1] == dateTopay) //busco por fechha de ayer
				)
				{
					resultClusterPayment.push(auxClusterPayments[j])
				}
			}
		}

		countPaymentsByEnrutator = resultClusterPayment.length;

		(countPaymentsByEnrutator > 0)? this._SystemResponse.ok = true : false //seteo el valor de logrado si el cluster resultante tiene objetos

		this._SystemResponse.data = {'total_payments': resultClusterPayment.length, 'payments': resultClusterPayment}

		return this._SystemResponse
	}

	public async countBussinesBySystem(id:string):Promise<responseInterface>
	{//funcion que le cuenta al momento cuantos negocios tiene a dispodicion el enrutador

		await this.getBussinesBySystemUsingIdEnrutator(id)
		this._SystemResponse.data = this._SystemResponse.data.total_bussines
		return this._SystemResponse
	}

	public async saveDataBySystem(data:Object)
	{//funcion que garda en la base de datos pasando el modelo que se require guardar

		await this._processData._saveDB(data).then( r => 
		{
			this._SystemResponse = r

		}, err => 
		{
			this.logger.debug(`Error: ${err}`)
		})

		return this._SystemResponse
	}

	public async getDataBySystem(schema:Model<any>, args:_argsFind = {findObject:{}}):Promise<responseInterface>
	{//funcion interfaz que me permite traerme todo las datas dependiendo del modelo parametrizado

        await this._processData._findAllDB(schema, args).then(r => 
        {
            this._SystemResponse = r

        }, err => 
        {
            this.logger.debug(`Error: ${err}`)
        });

		return this._SystemResponse
	}

    public async getDataBySystemWithPaginator(schema:Model<any>, args:_argsPagination):Promise<responseInterface>
    {//funcion para obtener los datos del sistema con paginador
        
        await this._processData._findDB(schema, args).then(r =>
        {
           this._SystemResponse = r

        }, err =>
        {
            this._SystemResponse = err
        });

        return this._SystemResponse  
    }

	
}
