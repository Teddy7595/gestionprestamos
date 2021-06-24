import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import 
{ 
	Nomina,
	Banco 
} from "../models/schemas/nomina.schema";

import 
{ 
	_configPaginator, 
	_dataPaginator, 
	_argsPagination, 
	_argsUpdate
} from 'src/Response/interfaces/interfaces.index';

import 
{ 
	responseInterface, 
	_argsFind 
} from "src/Response/interfaces/interfaces.index";

import 
{ 
	ProcessDataService, 
	DateProcessService 
} from "src/Classes/classes.index"; 

import
{
	CreateNominaDTO,
	ModifyNominaDTO
} from '../models/dto/index.dto';

@Injectable()
export class NominaService  
{ 
	_Response:responseInterface;

	constructor
	(
		@InjectModel(Nomina.name) private NominaModel:Model<Nomina>,
    	private _processData: ProcessDataService,
    	private _dateProcessService: DateProcessService
	){}

	async getAllNominas(enrutador_id:string): Promise<responseInterface> 
	{

    	const parameters: _dataPaginator = { // <- paginate parameters

    	  	page: 1 || _configPaginator.page,
    	  	limit: 12 || _configPaginator.limit,
    	  	customLabels: _configPaginator.customLabels,
    	  	sort: { _id: -1 },
      		populate: [
				{
					path: 'cobrador',
					select: '-pass',
					populate: {
						path: 'rol',
						select: 'alias'
					}
				}
			],
    	}

    	const args: _argsPagination = {

    	  findObject: {enrutador:enrutador_id},
    	  options: parameters

    	}

    	await this._processData._findDB(this.NominaModel, args).then(r => 
    	{
    	  this._Response = r;
    	}, err => 
    	{
    	  this._Response = err;
    	});

    	return this._Response;

  	}

  	async getOneNomina(nomina_id: string): Promise<responseInterface> 
  	{

	    const args: _argsFind = {
	      findObject: { _id: nomina_id,},
	      populate: 
	      [
	      	{
				path: 'cobrador',
				select: '-pass',
				populate: {
					path: 'rol',
					select: 'alias'
				}
			}
	      ]
	    }

	    await this._processData._findOneDB(this.NominaModel, args).then(r => 
	    {
	      this._Response = r;
	    }, err => 
	    {
	      this._Response = err;
	    });

	    return this._Response;
  	}

  	async createOneNomina(nomina:CreateNominaDTO):Promise<responseInterface>
  	{
  		let _Banco:Banco = {nombre:nomina.banco_nombre, cuenta:nomina.banco_cuenta};

  		const data = new this.NominaModel(nomina); 
  		data.banco = _Banco; 

	    await this._processData._saveDB(data).then(r => 
	    {
	      this._Response = r;
	    }, err => 
	    {
	      this._Response = err;
	    });
  		return this._Response;
  	}

  	async modifyOneNomina(nomina:ModifyNominaDTO): Promise<responseInterface>
	{

		// se crea un objeto con los nuevos valores
		const data = 
		{
			banco:
			{
				nombre: nomina.banco_nombre,
				cuenta: nomina.banco_cuenta
			},
			salario: nomina.salario,
			observacion: nomina.observacion,
			activo: nomina.activo,
			concurrencia: nomina.concurrencia,
		  	updatedAt: this._dateProcessService.setDate(),
		}
		// se crea el objeto de argumentos con el id de busqueda en especifico y la data a reemplazar en set
		const args: _argsUpdate = {
		  findObject: {
		    _id: nomina._id,
		  },
		  set: {
		    $set: data
		  },
		  populate: {
		    path: 'cobrador',
		    select: '-pass'
		  }
		}

		await this._processData._updateDB(this.NominaModel, args).then( async r => {

		  this._Response = r;
		  this._Response.message = 'Nomina actualizada';

		}, err => 
		{
		  this._Response = err;
		});

		return this._Response;
	}

	async modifyOneNominaByNomina(nomina:Nomina): Promise<responseInterface>
	{

		// se crea un objeto con los nuevos valores
		const data = nomina
		// se crea el objeto de argumentos con el id de busqueda en especifico y la data a reemplazar en set
		const args: _argsUpdate = {
		  findObject: {
		    _id: nomina._id,
		  },
		  set: {
		    $set: data
		  },
		  populate: {
		    path: 'cobrador',
		    select: '-pass'
		  }
		}

		await this._processData._updateDB(this.NominaModel, args).then( async r => {

		  this._Response = r;
		  this._Response.message = 'Nomina actualizada';

		}, err => 
		{
		  this._Response = err;
		});

		return this._Response;
	}

  	async deleteOneNomina(nomina_id:string):Promise<responseInterface>
	{
	    await this._processData._deleteSoftDB(this.NominaModel, nomina_id ).then(r  => 
	    {

	      this._Response = r;
	      this._Response.message = 'Nomina eliminada';

	    }, err => 
	    {
	      this._Response = err;
	    });

	    return this._Response;
	}

}
