import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DateProcessService, ProcessDataService } from 'src/Classes/classes.index';
import { Ruta } from 'src/Modules/enrutador/models/schemas/ruta.schema';
import
{
    responseInterface,
    _argsFind,
    _argsPagination,
    _argsUpdate,
    _configPaginator,
    _dataPaginator
} from 'src/Response/interfaces/interfaces.index';

import { Cliente, ClienteSchema } from '../models/schemas/cliente.schema';

@Injectable()
export class RutaClienteService
{
    private _Response:responseInterface;

    constructor
    (
        @InjectModel(Cliente.name) private clienteModel:Model<Cliente>,
        @InjectModel(Ruta.name) private rutaModel:Model<Ruta>,
        private _processData:ProcessDataService,
        private _dateProcessService:DateProcessService
    ){}

    async linkToRouteOneCliente(ruta:string, cliente:string):Promise<responseInterface>
    {
        const args: _argsFind =
        {
            findObject: { _id:ruta },
            populate: null
            // select: "rol"
        }

        await this._processData._findOneDB(this.rutaModel, args).then(r =>
        {
           return this.assignOneCliente(r.data, cliente);

        }, err =>
        {
            this._Response = err;
        });

        return this._Response;
    }

    private async assignOneCliente(ruta:Ruta, cliente:string):Promise<responseInterface>
    {
        ruta.negocios_id.push(cliente);
        ruta.updatedAt = this._dateProcessService.setDate();

        const _args:_argsUpdate =
        {
            findObject: { _id:ruta },
            set: { $set:ruta }
        }

        await this._processData._updateDB(this.rutaModel, _args).then(r =>
        {
            this._Response = r;

        }, err =>
        {

            this._Response = err;
        });

        return this._Response;
    }
}
