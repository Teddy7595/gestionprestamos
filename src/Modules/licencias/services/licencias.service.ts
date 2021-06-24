import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import 
{ 
    ProcessDataService, 
    DateProcessService 
} from "src/Classes/classes.index";
import 
{ 
    responseInterface, 
    _argsFind, 
    _configPaginator, 
    _dataPaginator, 
    _argsPagination, 
    _argsUpdate
} 
from 'src/Response/interfaces/interfaces.index';
import { creationLicenciaDto, modifyLicenciaDto } from '../models/dto/dto.index';
import { Licencia } from '../models/schemas/index.schema';


@Injectable()
export class LicenciasService 
{
    private _Response:responseInterface;

    constructor
    (
        @InjectModel(Licencia.name) private licenciaModel:Model<Licencia>,
        private _processData:ProcessDataService,
        private _dateService:DateProcessService
    ){}

    async getAllLicencias(): Promise<responseInterface> 
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
    
        await this._processData._findDB(this.licenciaModel, args).then(r => {
          this._Response = r;
        }, err => {
          this._Response = err;
          // this._Response.message =
        });
    
        return this._Response;
    }

    async createNewLicencia(licencia:creationLicenciaDto):Promise<responseInterface>
    {
        const data = new this.licenciaModel(licencia);
        

        await this._processData._saveDB(data).then(r => 
        {
            this._Response = r;
        }, err => 
        {
            this._Response.message = err;
        });

        return this._Response;
    }

    async modifyLicencia(licencia:creationLicenciaDto, id:string):Promise<responseInterface>
    {
        // se crea un objeto con los nuevos valores
        const data: modifyLicenciaDto = 
        {
            alias: licencia.alias,
            precio: licencia.precio,
            dias: licencia.dias,
            observacion: licencia.observacion,
            updatedAt: this._dateService.setDate()
        }
        // se crea el objeto de argumentos con el id de busqueda en especifico y la data a reemplazar en set
        const args: _argsUpdate = {
            findObject: {
                _id: id,
            },
            set: {
                $set: data
            }
        }

        await this._processData._updateDB(this.licenciaModel, args).then(r => {
            this._Response = r;

        }, err => {

            this._Response = err;
        });
        return this._Response;
    }

    async deleteLicencia(id:string):Promise<responseInterface>
    {
        await this._processData._deleteSoftDB(this.licenciaModel, id).then(r => 
        {

            this._Response = r;
            this._Response.message = 'Licencia eliminada';

        }, err => 
        {
            this._Response = err;

        });
        return this._Response;
    }
}
