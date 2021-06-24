import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
import { solicitudLicenciaDto } from '../models/dto/dto.index';
import { LicenciaSolicitud } from '../models/schemas/index.schema';
@Injectable()
export class SolicitudLicenciaService
{ 

    private _Response: responseInterface;
    
    constructor
    (
        private _processData: ProcessDataService,
        private _dateService: DateProcessService,
        @InjectModel(LicenciaSolicitud.name) private _solitudModel:Model<LicenciaSolicitud>
    ) { }

    //servicio para obtener todas las colitudes de licencia
    async getAllRequireNewLicencia(): Promise<responseInterface>
    {
        const parameters: _dataPaginator = { // <- paginate parameters

            page: 1 || _configPaginator.page,
            limit: 12 || _configPaginator.limit,
            customLabels: _configPaginator.customLabels,
            sort: {_id: -1},

        }

        //falta el populate de la clave de usuario
        const args: _argsPagination = {

            findObject: {},
            options: parameters

        }

        await this._processData._findDB(this._solitudModel, args).then(r =>
        {
            this._Response = r;
        }, err =>
        {
            this._Response = err;
            // this._Response.message =
        });

        return this._Response;
    }

    //servicio para obtener una solicitud por id
    async getOneRequireNewLicencia(id:string): Promise<responseInterface>
    {
        const parameters: _dataPaginator = { // <- paginate parameters

            page: 1 || _configPaginator.page,
            limit: 12 || _configPaginator.limit,
            customLabels: _configPaginator.customLabels,
            sort: { _id: -1 },
        }

        const args: _argsPagination = {
            findObject: {
                _id:id
            },
            options: parameters
        }

        await this._processData._findDB(this._solitudModel, args).then(r =>
        {
            this._Response = r;
        }, err =>
        {
            this._Response = err;
        });
        return this._Response;
    }

    //servicio para solicitar nueva licencia
    async postRequireNewLicencia(solicitud:solicitudLicenciaDto):Promise<responseInterface>
    {   
        const data = new this._solitudModel(solicitud);

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

    //servicio para eliminar una solicitud por admin
    async deleteRequiredLicencia(id:string):Promise<responseInterface>
    {   
        await this._processData._deleteSoftDB(this._solitudModel, id).then(r =>
        {
            this._Response = r;
        }, err =>
        {
            this._Response = err;
        });
        return this._Response;
    }
}
