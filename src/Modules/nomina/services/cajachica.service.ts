import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import 
{ 
	DateProcessService, 
	ProcessDataService 
} from 'src/Classes/classes.index';

import 
{ 
	responseInterface, 
	_argsFind, 
	_argsPagination, 
	_argsUpdate, 
	_configPaginator, 
	_dataPaginator 
} from 'src/Response/interfaces/interfaces.index';

import
{
	CreateCajaChicaDTO,
	ModifyCajaChicaDTO
	
} from "../models/dto/cajachica.dto"

import
{
	CajaChica
} from '../models/schemas/cajachica.schema'

@Injectable()
export class CajachicaService 
{
	private _Response:responseInterface;

	constructor
	(
		@InjectModel(CajaChica.name) private CajachicaModel:Model<CajaChica>,
		private _processData: ProcessDataService,
    	private _dateProcessService: DateProcessService
	){}

	sayHello():string
	{
		return 'Controlador para caja chica de cobrador';
	}

	async getAllCajachicaByEnrutator(enrutador:string):Promise<responseInterface>
	{
		const parameters: _dataPaginator = 
        { 
            page: 1 || _configPaginator.page,  
            limit: 12 || _configPaginator.limit,
            customLabels: _configPaginator.customLabels,
            sort: { _id: -1 },
            populate: 
            [
            	{
            		path: 'cobrador',
            		select: '-pass',
            		populate:
            		{
            			path: 'rol',
            			select: 'alias'
            		}
            	},
            	{
            		path: 'enrutador',
            		select: '-pass',
            		populate:
            		{
            			path: 'rol',
            			select: 'alias'
            		}
            	}
            ]
        }

        const args: _argsPagination = 
        {
            findObject: { enrutador: enrutador},
            options: parameters
        }

        await this._processData._findDB(this.CajachicaModel, args).then(r => 
        {
            this._Response = r;

        }, err => 
        {
            this._Response = err;
        });

		return this._Response;
	}

	async getOneCajachicaByID(id:string):Promise<responseInterface>
	{
        const args: _argsFind = 
        {
            findObject: { _id:id },
            populate: 
            [
            	{
            		path: 'cobrador',
            		select: '-pass',
            		populate:
            		{
            			path: 'rol',
            			select: 'alias'
            		}
            	},
            	{
            		path: 'enrutador',
            		select: '-pass',
            		populate:
            		{
            			path: 'rol',
            			select: 'alias'
            		}
            	}
            ]
        }

        await this._processData._findOneDB(this.CajachicaModel, args).then(r => 
        {
            this._Response = r;
        }, err => 
        {
            this._Response = err;
        });

		return this._Response;
	}

	async postOneCajachica(caja:CreateCajaChicaDTO):Promise<responseInterface>
  	{
  		const data = new this.CajachicaModel(caja); 

	    await this._processData._saveDB(data).then(r => 
	    {
	      this._Response = r;
	    }, err => 
	    {
	      this._Response = err;
	    });
  		return this._Response;
	}

	async putOneCajachica(caja:ModifyCajaChicaDTO):Promise<responseInterface>
	{
		// se crea un objeto con los nuevos valores
		const data = 
		{
			monto: caja.monto,
		  	updatedAt: this._dateProcessService.setDate(),
		}

		// se crea el objeto de argumentos con el id de busqueda en especifico y la data a reemplazar en set
		const args: _argsUpdate = {
		  findObject: {
		    _id: caja._id,
		  },
		  set: {
		    $set: data
		  },
		  populate: {
		    path: 'cobrador',
		    select: '-pass'
		  }
		}

		await this._processData._updateDB(this.CajachicaModel, args).then( async r => {

		  this._Response = r;
		  this._Response.message = 'Caja chicha actualizada!';

		}, err => 
		{
		  this._Response = err;
		});
		return this._Response;
	}

	async delCajachicaByID(id:string):Promise<responseInterface>
	{
	    await this._processData._deleteSoftDB(this.CajachicaModel, id ).then(r  => 
	    {

	      this._Response = r;
	      this._Response.message = 'Caja chicha eliminada !';

	    }, err => 
	    {
	      this._Response = err;
	    });

	    return this._Response;
	}
}
