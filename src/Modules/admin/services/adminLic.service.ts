import { Injectable } from '@nestjs/common';
import { responseInterface, _configPaginator, _argsPagination, _dataPaginator, _argsUpdate } from 'src/Response/interfaces/interfaces.index';
import { ProcessDataService, DateProcessService } from 'src/Classes/classes.index';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LicenseDto, LicenseChangeStatusDto } from '../models/dto/dto.index';
import { License } from '../models/schemas/licenseSchema';

@Injectable()
export class AdminLicService 
{
    private _Response:responseInterface;

    constructor
    (
        @InjectModel(License.name) private _licenseModel:Model<License>,
        private _processData:ProcessDataService,
        private _dateService:DateProcessService,
    )
    {}

    async getLicense():Promise<responseInterface>
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

        await this._processData._findDB(this._licenseModel, args).then(r =>
        {
            this._Response = r;
        }, err =>
        {
            this._Response = err;
            // this._Response.message =
        });

        return this._Response;
    }

    async getUserLicense(id:string):Promise<responseInterface>
    {
        const parameters: _dataPaginator = { // <- paginate parameters

            page: 1 || _configPaginator.page,
            limit: 12 || _configPaginator.limit,
            customLabels: _configPaginator.customLabels,
            sort: { _id: -1 },

        }

        const args: _argsPagination = {

            findObject: {
                usuario:id
            },
            options: parameters
        }

        await this._processData._findDB(this._licenseModel, args).then(r =>
        {
            this._Response = r;
        }, err =>
        {
            this._Response = err;
            // this._Response.message =
        });

        return this._Response;
    }

    async setUserLicense(license:LicenseDto):Promise<responseInterface>
    {
        const data = new this._licenseModel(license);

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

    async changeUserLicense(changeLic:LicenseChangeStatusDto, id:string):Promise<responseInterface>
    {
        // se crea un objeto con los nuevos valores
        const data: LicenseChangeStatusDto = 
        {
            status: changeLic.status,
            updatedAt: this._dateService.setDate()
        }
        // se crea el objeto de argumentos con el id de busqueda en especifico y la data a reemplazar en set
        const args: _argsUpdate = 
        {
            findObject: {
                usuario: id,
            },
            set: {
                $set: data
            }
        }

        await this._processData._updateDB(this._licenseModel, args).then(r =>
        {
            this._Response = r;

        }, err =>
        {
            this._Response = err;
            this._Response.data = null;
        });

        return this._Response;
    }

    async deleteUserLicense(id: string): Promise<responseInterface>
    {
        await this._processData._deleteSoftDB(this._licenseModel, id).then(r =>
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
