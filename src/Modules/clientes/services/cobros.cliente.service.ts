import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import
{
    DateProcessService,
    ProcessDataService
}
from 'src/Classes/classes.index';
import { TablaDiaria } from 'src/Modules/enrutador/models/schemas/tablaDiaria.schema';
import { TablaDiariaService } from 'src/Modules/enrutador/services/services.index';
import
{
    responseInterface,
    _argsFind,
    _argsPagination,
    _argsUpdate,
    _configPaginator,
    _dataPaginator
}
from 'src/Response/interfaces/interfaces.index';
import
{
    createCobroClienteDto,
    modifyCobroClienteDto,
}
from '../models/dto/index.dto';
//import {createCobroCliente, createCuotaCliente} from '../models/interfaces/interfaces.index';
import {Cobros} from '../models/schemas/cobros.schema';
import {Negocio, Cuota} from '../models/schemas/negocio.schema';
import {CambioCobro} from '../models/schemas/peticion.schema';



@Injectable()
export class CobrosClienteService
{
    private _Response:responseInterface;
    private _Cuota:any = {
        pagado: null,
        restante: null,
        penalizacion: null,
        cuotas_pagas: null,
        resumen: null
    };
    private _Negocio:Negocio;

    constructor
    (
        @InjectModel(Cobros.name) private _cobrosModel:Model<Cobros>,
        @InjectModel(CambioCobro.name) private _cambioModel:Model<CambioCobro>,
        @InjectModel(Negocio.name) private _negocioModel:Model<Negocio>,
        @InjectModel(Cuota.name) private _cuotaModel:Model<Cuota>,
        private _processData:ProcessDataService,
        private _dateProcessService:DateProcessService,
        private _tablaDiaria:TablaDiariaService
    ){}

    //aqui creo un nuevo pago
    async createNewPayment(cobro:createCobroClienteDto):Promise<responseInterface>
    {
        const args: _argsFind =
        {
            findObject: { _id:cobro.negocio_id },
            populate: null
        }
        await this._processData._findOneDB(this._negocioModel, args).then(r =>
        {
            this._Response = r;

            this._Response.message = 'El cobro ha sido realizado';

        }, err =>
        {
            this._Response = err;
        });

        return await this.treatmentCuotas(this._Response, cobro);
    }

    async getAllPaymentDo(cliente:string):Promise<responseInterface>
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
            findObject: { cliente_id: cliente },
            options: parameters
        }

        await this._processData._findDB(this._cobrosModel, args).then(r =>
        {
           this._Response = r;
        }, err =>
        {
            this._Response = err;
        });
        return this._Response;
    }


    async getOnePaymentDo(pago:string):Promise<responseInterface>
    {
        const args: _argsFind =
        {
            findObject: { _id:pago },
            populate: null
        }
        await this._processData._findOneDB(this._cobrosModel, args).then(r =>
        {
           this._Response = r;
        }, err =>
        {
            this._Response = err;
        });
        return this._Response;
    }

    async modifyOldPayment(body:modifyCobroClienteDto):Promise<responseInterface>
    {
        // se crea un objeto con los nuevos valores
        const data = new this._cambioModel(body);

        await this._processData._saveDB(data).then(r =>
        {
            this._Response = r;

        }, err =>
        {
            this._Response = err;
            this._Response.data = null;
        });
        return this._Response;
    }

    //recibo el negocio y el formato de cobro para procesarlo
    private async treatmentCuotas(value:responseInterface, cobro:createCobroClienteDto):Promise<responseInterface>
    {
        let _Negocio:Negocio;
        let _Cobro:Cobros;
        let data:Cuota = null;
        let tablaDiaria:TablaDiaria;

        //verifico si la respuesta de negocio tiene datos
        if(value.data == null){ return this._Response; }

        //manejo del negocio
        _Negocio = value.data;


        if (_Negocio.cuotas.length == 0)
        {
            //manipulación de la cuota con cobro
            data = await new this._cuotaModel(this.addNewCuota(_Negocio, cobro));

        }else
        {
            //manipulación de la cuota con cobro anterior
            data = await new this._cuotaModel(this.addCompoundCuota(_Negocio, cobro));
        }

         //sino tiene un carajo, se lo empujamos...
        _Negocio.cuotas.push(data);
        _Negocio.updatedAt = this._dateProcessService.setDate()
        //actualizamos las tablas de cobro y negocio
        cobro.cuota_nro = data.cuotas_pagas;
        _Negocio = await this.refreshNegocioCliente(_Negocio);
        _Cobro = await this.saveNewCobro(cobro);
        tablaDiaria = await this.refreshTabla(_Negocio._id);

        value.data = { negocio: _Negocio, cobro: _Cobro, cuota: data, tabla: tablaDiaria};

        return value;
    }

    //funcion que refresca las fehcas de la tabla diaria en base al pago de cuotas
    private async refreshTabla(id:string):Promise<TablaDiaria>
    {
        let response:TablaDiaria = new TablaDiaria()
        let aux:responseInterface
        let auxN:number = 0
        let auxD:string

        //busco la tabla en base al id del negocio
        aux = await this._tablaDiaria.getOneDiallyItem(id);
        response = aux.data

        //sencillamente seteo los dias con respecto a la concurrencia
        auxN = response.concurrencia
        auxD = this._dateProcessService.setDate()[1]
        response.prev_pago = response.next_pago
        response.next_pago = this._dateProcessService.getNextPointDate(auxN,auxD)

        //ahora solo llamo para actualizar el item de tabla
        return await this._tablaDiaria.updateAitemInTable(response)
    }

    private async saveNewCobro(cobro:createCobroClienteDto):Promise<Cobros>
    {
        let Response:Cobros;

        const data = new this._cobrosModel(cobro);

        await this._processData._saveDB(data).then(r =>
        {
            Response = r.data;
        },
        err =>
        {
            return err;
        });
        return Response;
    }

    private async refreshNegocioCliente(negocio:Negocio):Promise<Negocio>
    {
        let Response:Negocio;
        negocio.updatedAt = this._dateProcessService.setDate();
        const args: _argsUpdate = {
            findObject: {
                _id: negocio._id,
            },
            set: {
                $set:negocio
            }
        }

        await this._processData._updateDB(this._negocioModel, args).then(r =>
        {
            Response = r.data;
        }, err =>
        {
            return err;
        });

        return Response;
    }

    //calculo pago de cuota simple
    private addNewCuota(negocio:Negocio, cobro:createCobroClienteDto)
    {
        this._Cuota.pagado             = cobro.monto;
        this._Cuota.restante           = negocio.total - cobro.monto;
        this._Cuota.penalizacion       = negocio.vcuotas - cobro.monto;
        this._Cuota.cuotas_pagas       = 1;

        //genero el resumen de la actividad
        this.paymentResume(negocio);
        return this._Cuota;
    }

    //calculo pago de cuotas compuestas
    private addCompoundCuota(negocio:Negocio, cobro:createCobroClienteDto)
    {
        let aux:Cuota  = null;
        //genero la cuota normal
        this.addNewCuota(negocio, cobro);
        //me jalo la ultima cuota realizada
        aux = negocio.cuotas[negocio.cuotas.length -1];
        //console.log(aux);
        //opero la penalizacion, el restante y el nro de cuotas pagadas
        this._Cuota.restante      = aux.restante - cobro.monto ;
        this._Cuota.cuotas_pagas  = aux.cuotas_pagas +1;
        this._Cuota.penalizacion  = aux.penalizacion + this._Cuota.penalizacion;

        //genero el resumen de la actividad
        this.paymentResume(negocio);
        return this._Cuota;
    }

    private paymentResume(negocio:Negocio)
    {
        if (this._Cuota.penalizacion > 0)
        {
            this._Cuota.resumen =
            `El cliente debe pagar ${this._Cuota.penalizacion + negocio.vcuotas}, para el siguiente cobro`;

        }else if( this._Cuota.penalizacion == 0)
        {
            this._Cuota.resumen = "El cliente pago completo esta cuota";

        }if (this._Cuota.penalizacion < 0)
        {
            this._Cuota.resumen =
            `El cliente, pago la cuota y abonó ${ (-1) * this._Cuota.penalizacion}`;
        }
    }

}
