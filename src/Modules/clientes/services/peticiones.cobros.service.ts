import { Injectable } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import 
{
    DateProcessService, 
    ProcessDataService
} 
from 'src/Classes/classes.index';
import {responseInterface, _argsFind, _argsPagination, _argsUpdate, _configPaginator, _dataPaginator} from 'src/Response/interfaces/interfaces.index';
import {statusCobro} from '../models/enum/index.enum';
import {modifyCobrosCliente} from '../models/interfaces/interfaces.index';
import {Cobros} from '../models/schemas/cobros.schema';
import {CambioCobro} from '../models/schemas/peticion.schema';
import {Negocio, Cuota} from '../models/schemas/negocio.schema';

@Injectable() 
export class PeticionesCobrosService 
{
    private _Response:responseInterface;

    constructor
    (
        @InjectModel(CambioCobro.name) private _cambioCobroModel:Model<CambioCobro>,
        @InjectModel(Cobros.name) private _cobrosModel:Model<Cobros>,
        @InjectModel(Negocio.name) private _negocioModel:Model<Negocio>,
        private _processData:ProcessDataService,
        private _dateProcessService:DateProcessService
    ){}

    async getAllCobrosByEnrutador(id:string):Promise<responseInterface>
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
            findObject: { enrutador_id: id },
            options: parameters
        }

        await this._processData._findDB(this._cambioCobroModel, args).then(r => 
        {
           this._Response = r;
        }, err => 
        {
            this._Response = err;
        });
        
        return this._Response;
    }

    async getOneCobrosById(id:string):Promise<responseInterface>
    {
        const args: _argsFind = 
        {
            findObject: { _id:id },
            populate:
            [
                {
                    path: 'cobrador_id',
                    select: '-password'
                },
                {
                    path: 'cliente_id'
                },
                {
                    path: 'cobro_id'
                }
            ]
        }
        await this._processData._findOneDB(this._cambioCobroModel, args).then(r => 
        {
           this._Response = r;
        }, err => 
        {
            this._Response = err;
        });
        return this._Response;
    }

    async confirmarOneCobroById(id:string):Promise<responseInterface>
    {
        const args: _argsFind = { findObject: { _id:id }};
        let _Cobro:Cobros; 
        let _Negocio:Negocio; 
        let _Cambio:CambioCobro;

        await this._processData._findOneDB(this._cambioCobroModel, args).then(r => 
        {
            this._Response = r;
        }, err => 
        {
            this._Response = err;
        });

        //si encuentro data de cambio, empiezo el baile entre esquemas...
        if (this._Response.data)
        {
            this._Response = await this.refreshOnePetición(this._Response.data._id, statusCobro.APROBADO);
            _Cambio  = this._Response.data;
            _Cobro   = (await this.refreshOneCobro(this._Response.data)).data;
           _Negocio = (await this.findOneNegocio(_Cobro)).data;

            this._Response.data = {cobro:_Cobro, cambio:_Cambio, negocio:_Negocio };
        }

        return this._Response;
    }

    async denegarOneCobroById(id:string):Promise<responseInterface>
    {
        return await this.refreshOnePetición(id, statusCobro.DENEGADO);
    }

    //actualizo la peticion si es aprobada o no
    private async refreshOneCobro(data:CambioCobro):Promise<responseInterface>
    {
        // se crea un objeto con los nuevos valores
        const cobro: modifyCobrosCliente = 
        {
            monto: data.monto,
            observacion: data.observacion,
            status: statusCobro.MODIFICADO,
            updatedAt: this._dateProcessService.setDate()
        }
        // se crea el objeto de argumentos con el id de busqueda en especifico y la data a reemplazar en set
        const args: _argsUpdate = {
            findObject: {
                _id: data.cobro_id,
            },
            set: {
                $set: cobro 
            }
        }

        await this._processData._updateDB(this._cobrosModel, args).then(r => {
            this._Response = r;
        }, err => {

            this._Response = err;
        });

        return this._Response;
    }

    private async refreshOnePetición(id:string, status:string):Promise<responseInterface>
    {
        // se crea el objeto de argumentos con el id de busqueda en especifico y la data a reemplazar en set
        const args: _argsUpdate = {
            findObject: {
                _id: id,
            },
            set: {
                $set:
                { 
                    'status': status,
                    'updatedAt': this._dateProcessService.setDate()
                }
            }
        }

        await this._processData._updateDB(this._cambioCobroModel, args).then(r => 
        {
            this._Response = r;
        }, err => 
        {
            this._Response = err;
        });

        return this._Response;
    }

    //busco el negocio para luego modificarlo
    private async findOneNegocio(cobro:Cobros):Promise<responseInterface>
    {
        //console.log(cobro);

        const args: _argsFind = { findObject: { _id:cobro.negocio_id }};

        await this._processData._findOneDB(this._negocioModel, args).then(r => 
        {
            this._Response = r;
        }, err => 
        {
            this._Response = err;
        });

        return await this.refreshOneNegocio(this._Response.data, cobro);
    }

    //modifico el negocio
    private async refreshOneNegocio(negocio:Negocio, cobro:Cobros):Promise<responseInterface>
    {
        if (!negocio) return;

        await negocio.cuotas.find( r =>
        { 
            if(r.cuotas_pagas == cobro.cuota_nro)
            {
               return this.reviewOldCuota(negocio, r, cobro);
            }  

        });

        negocio.updatedAt = this._dateProcessService.setDate();
        //ahora actualizo el negocio con los cambios
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
            this._Response = r;
        }, err => 
        {
            this._Response = err;
        });

        return this._Response;
    }

    //calculo pago de cuota simple
    private reviewOldCuota(negocio:Negocio, cuota:Cuota, cobro:Cobros)
    {
        cuota.pagado             = cobro.monto;
        cuota.restante           = negocio.total - cobro.monto;
        cuota.penalizacion       = negocio.vcuotas - cobro.monto;
        cuota.cuotas_pagas       = 1;

        //genero el resumen de la actividad
        return this.paymentResume(negocio, cuota);
    }

    private paymentResume(negocio:Negocio, cuota:Cuota)
    {
        if (cuota.penalizacion > 0) 
        {
            cuota.resumen = 
            `El cliente debe pagar ${cuota.penalizacion + negocio.vcuotas}, para el siguiente cobro`;
        
        }else if( cuota.penalizacion == 0)
        {
            cuota.resumen = "El cliente pago completo esta cuota";

        }if (cuota.penalizacion < 0) 
        {
            cuota.resumen = 
            `El cliente, pago la cuota y abonó ${ (-1) * cuota.penalizacion}`;
        }

        return cuota;
    }
}
