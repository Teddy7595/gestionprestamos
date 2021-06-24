import { Injectable } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import 
{
    ProcessDataService, 
    DateProcessService
} 
from 'src/Classes/classes.index';
import 
{
    responseInterface, 
    _argsPagination, 
    _configPaginator, 
    _dataPaginator
} 
from 'src/Response/interfaces/interfaces.index';
import {BitacoraDto, GetReportDto} from '../models/dto/index.dto';
import {Bitacora} from '../models/schemas/bitacora.schema';

@Injectable()
export class BitacoraService 
{
    private _Response:responseInterface;

    constructor
    (
        private _processData:ProcessDataService,
        private _dateProcessService:DateProcessService,
        @InjectModel(Bitacora.name) private bitacoraModel:Model<Bitacora>
    ){}

    async getAllReportLog():Promise<responseInterface>
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
            findObject: {},
            options: parameters
        }

        await this._processData._findDB(this.bitacoraModel, args).then(r => 
        {
            this._Response = r;

        }, err => 
        {
            this._Response = err;
        });
        return this._Response; 
    }

    async getOneReportLog(log:GetReportDto):Promise<responseInterface>
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
            findObject: {_id:log._id, actor:log.actor, type:log.type},
            options: parameters
        }

        await this._processData._findDB(this.bitacoraModel, args).then(r => 
        {
            this._Response = r;

        }, err => 
        {
            this._Response = err;
        });
        return this._Response; 
    }

    async getReportLog(log:GetReportDto):Promise<responseInterface>
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
            findObject: {actor: log.actor, type: log.type},
            options: parameters
        }

        await this._processData._findDB(this.bitacoraModel, args).then(r => 
        {
            this._Response = r;

        }, err => 
        {
            this._Response = err;
        });
        return this._Response;
    }

    async generateLog(log:BitacoraDto):Promise<responseInterface>
    {
        const data = new this.bitacoraModel(log);
        
        await this._processData._saveDB(data).then(r => 
        {
            this._Response = r;
        }, 
        err => 
        {
            this._Response = err;
        });
        return this._Response;
    }


}
