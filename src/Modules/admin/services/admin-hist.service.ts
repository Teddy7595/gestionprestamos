import { Injectable } from '@nestjs/common';
import { responseInterface, _dataPaginator, _configPaginator, _argsPagination } from 'src/Response/interfaces/interfaces.index';
import { ProcessDataService, DateProcessService } from 'src/Classes/classes.index';
import { Model } from 'mongoose';
import { History } from '../models/schemas/historialSchema';
import { InjectModel } from '@nestjs/mongoose';
import { BitacoraInterface } from '../models/interfaces/bitacora.interface';

@Injectable()
export class AdminHistService 
{
    private _Response:responseInterface;
    constructor
    ( 
        @InjectModel(History.name) private _historyModel:Model<History>,
        private _processData: ProcessDataService,
        private _dateProcess: DateProcessService
    )
    {}

    async getBitacora()
    {
        const parameters: _dataPaginator = { // <- paginate parameters

            page: 1 || _configPaginator.page,
            limit: 12 || _configPaginator.limit,
            customLabels: _configPaginator.customLabels,
            sort: { _id: -1 },

        }

        const args: _argsPagination = {

            findObject: {},
            options: parameters

        }

        await this._processData._findDB(this._historyModel, args).then(r =>
        {
            this._Response = r;
        }, err =>
        {
            this._Response = err;
            // this._Response.message =
        });

        return this._Response;
    }

    async setBitacora(bitacora:BitacoraInterface)
    {
        const data = new this._historyModel(bitacora);

        await this._processData._saveDB(data).then(r =>
        {
            this._Response = r;
        }, err =>
        {
            this._Response = null;
            this._Response.data = null
        });

        return this._Response;
    }

}
