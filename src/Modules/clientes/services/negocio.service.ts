import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import
{
    DateProcessService,
    ProcessDataService
}
from 'src/Classes/classes.index';
import {Ruta} from 'src/Modules/enrutador/models/schemas/ruta.schema';
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
    NegocioCreacionDto,
    NegocioModificacionDto,
    NegocioPeticionDto, 
    NegocioUnicoPeticionDto,

}
from '../models/dto/index.dto';
import {Negocio} from '../models/schemas/negocio.schema';
import {TablaDiariaService} from 'src/Modules/enrutador/services/tabla-diaria.service';

@Injectable()
export class NegocioService
{
    // private _Response:responseInterface;
    // constructor
    // (
    //     @InjectModel(Negocio.name) private _negocioModel:Model<Negocio>,
    //     @InjectModel(Ruta.name) private RutaModel:Model<Ruta>,
    //     private _processData:ProcessDataService,
    //     private _dateProcessService:DateProcessService
    // ){}

    // async getAllNegocio(negocio:NegocioPeticionDto):Promise<responseInterface>
    // {
    //     const parameters: _dataPaginator =
    //     {
    //         page: 1 || _configPaginator.page,
    //         limit: 12 || _configPaginator.limit,
    //         customLabels: _configPaginator.customLabels,
    //         sort: { _id: -1 },
    //     }

    //     const args: _argsPagination =
    //     {
    //         findObject: { cliente_id: negocio.cliente_id },
    //         options: parameters
    //     }

    //     await this._processData._findDB(this._negocioModel, args).then(r =>
    //     {
    //        this._Response = r;
    //     }, err =>
    //     {
    //         this._Response = err;
    //     });

    //     return this._Response;
    // }

    // async getOneNegocio(negocio:NegocioUnicoPeticionDto):Promise<responseInterface>
    // {
    //     const args: _argsFind =
    //     {
    //         findObject: { _id:negocio._id, cliente_id: negocio.cliente_id },
    //         populate: null
    //     }
    //     await this._processData._findOneDB(this._negocioModel, args).then(r =>
    //     {
    //        this._Response = r;
    //     }, err =>
    //     {
    //         this._Response = err;
    //     });
    //     return this._Response;
    // }





    // async makeOneNegocio(negocio: any, idRuta: string):Promise<responseInterface>
    // {
    //     const data = new this._negocioModel(negocio);

    //     data.total = negocio.venta + (negocio.venta * (negocio.interes/100));
    //     data.vcuotas = data.total/negocio.ncuotas;


    //     await this._processData._saveDB(data).then(async (r) =>
    //     {
    //         this._Response = r;

    //        await this.addNegocioToRuta(idRuta, data._id);

    //        this._Response.message = 'Venta creada';
    //     },
    //     err =>
    //     {
    //         this._Response = err;
    //     });
    //     return this._Response;
    // }

    // async modifyOneNegocio(negocio:NegocioModificacionDto):Promise<responseInterface>
    // {
    //     // se crea un objeto con los nuevos valores
    //     const data = new this._negocioModel(negocio);

    //     await this._processData._saveDB(data).then(r =>
    //     {
    //         this._Response = r;

    //     }, err =>
    //     {
    //         this._Response = err;
    //         this._Response.data = null;
    //     });
    //     return this._Response;
    // }



    // ----------------------------------------------------------------------------------------

    private _Response:responseInterface;

    constructor
    (
        // @InjectModel(Negocio.name) private _negocioModel:Model<Negocio>,
        // private _processData:ProcessDataService,
        // private _dateProcessService:DateProcessService

        @InjectModel(Negocio.name) private _negocioModel:Model<Negocio>,
        @InjectModel(Ruta.name) private RutaModel:Model<Ruta>,
        private _tablaDiariaService:TablaDiariaService,
        private _processData:ProcessDataService,
        private _dateProcessService:DateProcessService

    ){}



    async addNegocioToRuta(idRuta: string, idNegocio: string){

        const args: _argsFind =
        {
            findObject: { _id: idRuta },
            populate: null
        }
        await this._processData._findOneDB(this.RutaModel, args).then( async (r) =>
        {
           this._Response = r;

            let x: Ruta = r.data;

            x.negocios_id.push(idNegocio);
            x.updatedAt = this._dateProcessService.setDate();

            console.log('la x', x);

           await this._processData._saveDB(x).then(r =>
            {
                this._Response = r;
            },
            err =>
            {
                console.log('error1', err);
                this._Response = err;
            });

        }, err =>
        {
            console.log('error2', err);
            this._Response = err;
        });

    }

    async getAllNegocio(negocio:NegocioPeticionDto):Promise<responseInterface>
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
            findObject: { cliente_id: negocio.cliente_id },
            options: parameters
        }

        await this._processData._findDB(this._negocioModel, args).then(r =>
        {
           this._Response = r;
        }, err =>
        {
            this._Response = err;
        });

        return this._Response;
    }

    async getOneNegocio(negocio:NegocioUnicoPeticionDto):Promise<responseInterface>
    {
        const args: _argsFind =
        {
            findObject: { _id:negocio._id, cliente_id: negocio.cliente_id },
            populate: null
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

    async makeOneNegocio(negocio:NegocioCreacionDto, idRuta):Promise<responseInterface>
    {
        const data = new this._negocioModel(negocio);

        data.total = negocio.venta + (negocio.venta * (negocio.interes/100));
        data.vcuotas = data.total/negocio.ncuotas;

        await this._processData._saveDB(data).then( async (r) =>
        {
            this._Response = r;

            await this.addNegocioToRuta(idRuta, data._id);

            this._Response.message = 'Venta añadida';
            await this._tablaDiariaService.manualSaveITem(data._id, idRuta);
        },
        err =>
        {
            this._Response = err;
        });
        return this._Response;
    }

    async modifyOneNegocio(negocio:NegocioModificacionDto):Promise<responseInterface>
    {
        // se crea un objeto con los nuevos valores
        const data = new this._negocioModel(negocio);

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

}

