import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Cron } from '@nestjs/schedule'
import { Model } from 'mongoose'
import { DateProcessService, ProcessDataService } from 'src/Classes/classes.index'
import { _argsPagination, responseInterface, _argsFind, _configPaginator, _dataPaginator, _argsUpdate } from 'src/Response/interfaces/interfaces.index'
import { Ruta } from '../models/schemas/ruta.schema'
import { Negocio } from 'src/Modules/clientes/models/schemas/negocio.schema'
import { TablaDiaria } from '../models/schemas/tablaDiaria.schema'


@Injectable()
export class TablaDiariaService 
{
    private readonly logger:Logger = new Logger("Centinala diario") //log del CRON
    private _Response:responseInterface //interfaz de respuesta
    private clusterRoutes:Array<any> //variable para obtener todas las rutas almacenadas en coleccion
    private readonly backDay:String //variable con la expresión de fecha, parámetro de busqueda
    private readonly thisDay:String 
    private iteratorSafe:number //Contador de items guardados

    constructor
    (
        private readonly _processData:ProcessDataService,
        private readonly _dateProcessService:DateProcessService,
        @InjectModel(Ruta.name) private readonly _rutaModel:Model<Ruta>,
        @InjectModel(TablaDiaria.name) private _tablaDiariaModel:Model<TablaDiaria>,
        @InjectModel(Negocio.name) private _negocioModel:Model<Negocio>
    )
    {
        this.logger.setContext("Sistema de Tabla Diaria")
        this.iteratorSafe = 0
        this.backDay = this._dateProcessService.getNextPointInTime(-1) //seteo la cantidad de dias hacia atras, en este caso 1dia
        this.thisDay = this._dateProcessService.setDate()[1] //seteo la fecha de hoy para comprar con los datos de petición
        
    }
    
    //reloj de sistema para las tablas diarias
    //("00 30 3 */1 * *")
    
    @Cron('00 30 3 */1 * *',
    {
        name: "Tabla Diaria" 
    })
    private async handleCron()
    {
        //esta primera fase será solo para crear los items recien añadidos a las rutas y establecer su loop de cobro
        console.clear();
        this.logger.debug("Protocolo para tablas diarias de cobro:")
        this.logger.debug(`Dia parámetro para busqueda de datos: ${this.backDay}`)
        this.logger.debug("1) Obteniendo todos los items de la coleccion RUTAS...")
        await this.getAllRoutes()
        await this.searchChangeInRouteSchema()
        await this.searchNewBussinesInStackRoutes()
        
        
        
    }

    //funcion para obtener los cobros correspondientes en base al id del enrutador 
    public async getDiallyByEnrutator(idEnrutator:string):Promise<responseInterface>
    {
        const parameters: _dataPaginator =
        {
            page: 1 || _configPaginator.page,
            limit: 12 || _configPaginator.limit,
            customLabels: _configPaginator.customLabels,
            sort: { _id: -1 },
        }

        const args: _argsPagination =
        {
            findObject: { enrutador_id: idEnrutator },
            options: parameters
        }

        await this._processData._findDB(this._tablaDiariaModel, args).then(r =>
        {
           this._Response = r
           this.filterTodayBussines()
        }, err =>
        {
            this._Response = err
        });

        return this._Response  
    }

    //funcion para obtener los cobros correspondientes en base al id del cobrador
    public async getDiallyByCollector(idCollector:string):Promise<responseInterface>
    {
        const parameters: _dataPaginator =
        {
            page: 1 || _configPaginator.page,
            limit: 12 || _configPaginator.limit,
            customLabels: _configPaginator.customLabels,
            sort: { _id: -1 },
        }

        const args: _argsPagination =
        {
            findObject: { cobrador_id: idCollector},
            options: parameters
        }

        await this._processData._findDB(this._tablaDiariaModel, args).then(r =>
        {
           this._Response = r
           this.filterTodayBussines()
        }, err =>
        {
            this._Response = err
        });

        return this._Response  
    }

    //funcion que me retorna un item en especifico de la tabla diaria
    public async getOneDiallyItem(id:string):Promise<responseInterface>
    {
        const args: _argsFind =
        {
            findObject: { negocio_id:id },
            populate: 
            [   
                {
                    path: 'negocios_id',
                    model: 'Negocio', // <- si es un array de ids se debe especificar el model
                },
                {
                    path: 'ruta_id',
                    model: 'Ruta', // <- si es un array de ids se debe especificar el model
                },
                {
                    path: 'cliente_id',
                    model: 'Cliente', // <- si es un array de ids se debe especificar el model
                },
                {
                    path: 'cobrador_id',
                    model: 'User', // <- si es un array de ids se debe especificar el model
                },
            ]
        }
        await this._processData._findOneDB(this._tablaDiariaModel, args).then(r =>
        {
           this._Response = r;
        }, err =>
        {
            this._Response = err;
        });
        return this._Response;
    }

    //funcion para guardar manualmente un item diario en caso de no haberse dado de forma automatica
    public async manualSaveITem(idNegocio:string, idRuta:string):Promise<responseInterface>
    {
        let auxBussines:Negocio = new Negocio()
        let auxRoute:Ruta = new Ruta()
        let auxResponse:responseInterface

        //en base al _id de ambos solicitados busco en la base de datos de cada uno
        auxResponse = await this.getOneNegocio(idNegocio)
        auxRoute = auxResponse.data
        auxResponse = await this.getOneRoute(idRuta)
        auxBussines = auxResponse.data

        //si ambos existen preparo un nuevo item de tabla diaria
        if(auxBussines && auxRoute)
        {
            //preparo los datos del negocio y la ruta para guardar y setea el _Response
            await this.prepareEachBussines(auxBussines, auxRoute)
        }else
        {
            this._Response.status = 404
            this._Response.message = 'Posiblemente no exista o el negocio o la ruta creada'
        }

        //luego del procemiento anterior, retorno la respuesta
        return this._Response
        
    }

    //funcion que me permita actualizar los items de tabla diaria
    public async updateAitemInTable(tabla:TablaDiaria):Promise<TablaDiaria>
    {
        let Response:TablaDiaria
        
        const args: _argsUpdate = {
            findObject: {
                _id: tabla._id,
            },
            set: {
                $set:tabla
            }
        }

        await this._processData._updateDB(this._tablaDiariaModel, args).then(r =>
        {
            Response = r.data;
        }, err =>
        {
            return err;
        });

        return Response;
    }

    //funcion que se ocupará de revisar si existe fecha de modificación y si tienen 1 dia de haber sido modificadas
    private async searchChangeInRouteSchema()
    {
        this.logger.debug("2) Buscando modificaciones hechas en menos de un dia...")
        //empiezo la depuración de aquellas rutas que tengan menos de un dia de modificadas
        if(this._Response.data.length ===1)
        {//si el array tiene solo 1 item, hago el procedimiento sobre la misma variable de _Response
         //y lo paso directamente al cluster de datos si su fecha cumple con los datos de busqueda
            this.logger.debug('   Procedimiento con 1 item en la pila...');
            (this._Response.data[0].updatedAt[1] == this.backDay)? this.clusterRoutes = this._Response.data : false

        }else
        {//sino, ya aqui se tendría que hacer un filtro buscando aquellos datos que cumplan con los parámetros
         //PD: la funcion filter tiende a ser pesada cuando existen grandes cantidades de datos, pero por 
         //productividad se optó por usarla

            this.logger.debug("   Procedimiento con varios items en la pila...")
            this.logger.debug(`   Cantidad de items totales: ${this._Response.data.length +1} items`)
            this.clusterRoutes = this._Response.data.filter( cluster =>  cluster.updatedAt[1] == this.backDay ) 
            this.logger.debug(`   Cantidad de items depurados: ${this.clusterRoutes.length +1} items`)
        }
    }

    //funcion que me retorna una ruta en especifico
    private async getOneRoute(ruta:string):Promise<responseInterface>
    {

        const args: _argsFind =
        {
            findObject:{ _id:ruta }
        }

        await this._processData._findOneDB(this._rutaModel, args).then(r =>
        {
            this._Response = r;
        }, err =>
        {
            this._Response = err;
        });

        return this._Response;
    }

    //funcion que me retorna un negocio en específico
    private async getOneNegocio(negocio:string):Promise<responseInterface>
    {
        const args: _argsFind =
        {
            findObject: { _id:negocio}
        }
        await this._processData._findOneDB(this._negocioModel, args).then(r =>
        {
           this._Response = r;
        }, err =>
        {
            this._Response = err;
        });

        return this._Response;
    }

    //funcion que se ocupará de buscar los negocios nuevos en la pila de negocios en cada ruta en la variable de Cluster
    private async searchNewBussinesInStackRoutes()
    {
        this.iteratorSafe = 0//seteo el contador de items guardados a 0 por cada vez que se reinicie la operacion
        this.logger.debug('3) Iniciando procedimiento con el stack de negocios...')
        let countBussines:number = 0 //contador de negocios
        if(this.clusterRoutes.length === 1)
        {
            for(let j:number = 0; j < this.clusterRoutes[0].negocios_id.length; j++)
            {
                //al comprobar las fechas sean las indicadas, paso la información a la etapa final de busqueda
                (this.clusterRoutes[0].negocios_id[j].createdAt[1] == this.backDay)? 
                await this.prepareEachBussines(this.clusterRoutes[0].negocios_id[j], this.clusterRoutes[0]) : false
                countBussines += 1
            }
            
        }else 
        {
            for(let i:number = 0; i < this.clusterRoutes.length; i++)
            {
                for(let j:number = 0; j < this.clusterRoutes[i].negocios_id.length; j++)
                {
                    //al comprobar las fechas sean las indicadas, paso la información a la etapa final de busqueda
                    if(this.clusterRoutes[i].negocios_id[j].createdAt[1] == this.backDay)
                    {
                        await this.prepareEachBussines(this.clusterRoutes[i].negocios_id[j], this.clusterRoutes[i])
                        countBussines += 1
                    }
                    
                }
            }
        }
        this.logger.debug(`   Items guardados: ${this.iteratorSafe}`)
        this.logger.debug(`   Cantidad de negocios contabilizados y tratados: ${countBussines}`)
    }

    //funcion que opera dentro de cada item del stack de negocio  y obteniendo los datos para tabla diaria
    private async prepareEachBussines(bussines:Negocio, route:Ruta)
    {
        let auxDiaria:TablaDiaria = new this._tablaDiariaModel()
        let concurrencia:number = bussines.concurrencia

        auxDiaria.enrutador_id  = route.enrutador_id
        auxDiaria.cobrador_id   = bussines.cobrador_id
        auxDiaria.cliente_id    = bussines.cliente_id
        auxDiaria.negocio_id    = bussines._id
        auxDiaria.ruta_id       = route._id
        auxDiaria.concurrencia  = bussines.concurrencia
        auxDiaria.pendiente     = bussines.pendiente
        auxDiaria.next_pago     = this._dateProcessService.getNextPointDate(concurrencia, bussines.createdAt[1])
        await this.saveOneBussines(auxDiaria); //guardo automaticamente los nuevos items en base de datos 
    }

    //funcion que verifica si el proximo pago es igual al dia en que se la petición de busqueda
    private async filterTodayBussines()
    {
        let purifyResponse:Array<any> = Array()
        //basandome en el mismo principio que la funcion de busqueda de nuevos datos
        //aqui en vez de comprarlo con el dia anterior, lo compararé usando el dia de 
        //la petición
        for(let j:number = 0; j < this._Response.data.length; j++)
        {
            (this._Response.data[j].next_pago[1] == this.thisDay)? 
            purifyResponse[j] = this._Response.data[j]: false
        }

        //operador ternario para darle congruencia a los datos del respnse en base al filtro
        (purifyResponse.length == 0)? 
        this._Response.message = 'No hay clientes por cobrar':
        this._Response.message = `Existen pendientes ${purifyResponse.length} clientes por cobrar`

        this._Response.data = purifyResponse
    }

    //funcion dedicada al guardado de las nuevas entradas
    private async saveOneBussines(data:TablaDiaria)
    {
        await this._processData._saveDB(data).then( async (r) =>
        {
            this.iteratorSafe += 1
            this._Response = r
        },
        err =>
        {
            this._Response = err
        });
        return this._Response
    }

    public async getAllRoutes()
    {//funcion dedicada a obtener todas las rutas para el sistema
        const args: _argsFind = 
        {
            findObject: {},
            populate: 
            [{
                path: 'negocios_id',
                model: 'Negocio', // <- si es un array de ids se debe especificar el model
            }]    
        }

        await this._processData._findAllDB(this._rutaModel, args).then(r => 
        {
            this._Response = r

        }, err => 
        {
            this._Response = err
        });
        return this._Response.data
    }
}
