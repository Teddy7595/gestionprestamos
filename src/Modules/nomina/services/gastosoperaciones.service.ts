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

//import { GastosOperacion } from '../models/schemas/gastosop.schema';

import 
{
	CreateGastosOpDTO,
	ModifyGastosOpDTO,
	RetrieveGastosOpDTO,
	DeleteGastosOpDTO

} from '../models/dto/index.dto';

import { CajachicaService } from './cajachica.service';

import { CajaChica, GastosOperacion } from '../models/schemas/cajachica.schema';

@Injectable()
export class GastosoperacionesService 
{
	private _Response:responseInterface;

	constructor
	(
		@InjectModel(GastosOperacion.name) private GastosModel:Model<GastosOperacion>,
		@InjectModel(CajaChica.name) private CajachicaModel:Model<CajaChica>,
		private _cajaChicaService: CajachicaService,
		private _processData: ProcessDataService,
    	private _dateProcessService: DateProcessService
	)
	{}
/*
	async getAllGastosOperacion(id:string):Promise<responseInterface>
	{
		const parameters: _dataPaginator = 
        { 
            page: 1 || _configPaginator.page,  
            limit: 12 || _configPaginator.limit,
            customLabels: _configPaginator.customLabels,
            sort: { _id: -1 }
        }

        const args: _argsPagination = 
        {
            findObject: { enrutador: id},
            options: parameters
        }

        await this._processData._findDB(this._gastosOpercaionModel, args).then(r => 
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
            	},
            	{
            		path: 'cajachica',
            		select: ''
            	}
            ]
        }

        await this._processData._findOneDB(this._gastosOpercaionModel, args).then(r => 
        {
            this._Response = r;
        }, err => 
        {
            this._Response = err;
        });

		return this._Response;
	}

	async postOneRegistroGastosOperacion(gasto:CreateGastosOpDTO):Promise<responseInterface>
  	{
  		const data = new this._gastosOpercaionModel(gasto); 

	    await this._processData._saveDB(data).then(r => 
	    {
	      this._Response = r;
	    }, err => 
	    {
	      this._Response = err;
	    });
  		return this._Response;
	}

	async putOneRegistroGastosOperacion(gasto:ModifyGastosOpDTO):Promise<responseInterface>
	{
		// se crea un objeto con los nuevos valores
		const data = 
		{
			monto: gasto.monto,
			desc: gasto.desc,
		  	updatedAt: this._dateProcessService.setDate()
		}

		// se crea el objeto de argumentos con el id de busqueda en especifico y la data a reemplazar en set
		const args: _argsUpdate = {
		  findObject: {
		    _id: gasto._id,
		  },
		  set: {
		    $set: data
		  }
		}

		await this._processData._updateDB(this._gastosOpercaionModel, args).then( async r => {

		  this._Response = r;
		  this._Response.message = 'Gasto de operacion actualizado!';

		}, err => 
		{
		  this._Response = err;
		});
		return this._Response;
	}

	async deleteRegistroGastosOperacion(id:string):Promise<responseInterface>
	{
	    await this._processData._deleteSoftDB(this._gastosOpercaionModel, id ).then(r  => 
	    {

	      this._Response = r;
	      this._Response.message = 'Gasto de operacion eliminado !';

	    }, err => 
	    {
	      this._Response = err;
	    });

	    return this._Response;
	}*/

	private async callServiceCajaChica(_cajachica:string)
	{
		await this._cajaChicaService.getOneCajachicaByID(_cajachica).then(r => 
        {
        	this._Response = r; 

        }, err => 
        {
            this._Response = err;
        });
	}

	private async callServiceRefreshCajaChica(_id:string, data:CajaChica)
	{
		// se crea un objeto con los nuevos valores
		data.updatedAt = this._dateProcessService.setDate();

		// se crea el objeto de argumentos con el id de busqueda en especifico y la data a reemplazar en set
		const args: _argsUpdate = {
		  findObject: {
		    _id: _id,
		  },
		  set: {
		    $set: data
		  },
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

		await this._processData._updateDB(this.CajachicaModel, args).then( async r => {

		  this._Response = r;
		  this._Response.message = 'Caja chicha actualizada!';

		}, err => 
		{
		  this._Response = err;
		});
	}
	
	//llamo al service de obtener la caja chica y luego extraigo el hitorial de gastos
	async getAllGastosOperacion(ids:RetrieveGastosOpDTO):Promise<responseInterface>
	{
		await this._cajaChicaService.getOneCajachicaByID(ids._cajachica).then(r => 
        {
        	this._Response = r; 
        	this._Response.data = r.data.gasto;

        	(this._Response.data.length == 0)? this._Response.message = "No existen gastos de operacion actualmentel" : true;

        }, err => 
        {
            this._Response = err;
        });
		return this._Response;
	}

	async getOneGastoOperacion(ids:RetrieveGastosOpDTO):Promise<responseInterface>
	{
		await this.callServiceCajaChica(ids._cajachica);
		this._Response.data = this._Response.data.gasto[ids.index];
		return this._Response;
	}

	async postOneGastosOperacion(gasto:CreateGastosOpDTO):Promise<responseInterface>
	{
		await this.callServiceCajaChica(gasto._cajachica);
		let auxCaja:CajaChica = this._Response.data;
		let newGasto:GastosOperacion = new this.GastosModel(gasto);

		if (!auxCaja) return;

		newGasto.monto_caja = auxCaja.monto; // guardamos el valor de la caja previo al gasto

		auxCaja.monto = auxCaja.monto - gasto.monto;

		if(!auxCaja.gasto)
		{
			auxCaja.gasto = Array(newGasto);
		}else
		{
			auxCaja.gasto.push(newGasto);
		}
		await this.callServiceRefreshCajaChica(gasto._cajachica, auxCaja);

		return this._Response;
	}

	async putOneGastosOperacion(gasto:ModifyGastosOpDTO):Promise<responseInterface>
	{
		await this.callServiceCajaChica(gasto._cajachica);
		let auxCaja:CajaChica = this._Response.data;
		let oldGasto:GastosOperacion = null;

		//sino existe dato, retorna
		if (!auxCaja) return;
		else if(auxCaja.gasto) 
		{	//de lo contrario busca el indice del gasto y toma los datos que encuentre
			oldGasto = auxCaja.gasto[auxCaja.gasto.length-1];
			//corrije el monto de la caja basado en el monto backup registrado en el gasto
			auxCaja.monto = oldGasto.monto_caja - gasto.monto;
			//luego sobreescribimos la correcion del gasto junto a su descripcion x si acaso
			oldGasto.monto = gasto.monto;
			oldGasto.desc = gasto.desc;
			//luego sobreescribimos todo el esquema nuevamente dentro de su respectiva posicion en el array
			auxCaja.gasto.splice[auxCaja.gasto.length-1] = oldGasto;
		}
		//para luego llamar y actualizar el modelo 
		await this.callServiceRefreshCajaChica(gasto._cajachica, auxCaja);

		return this._Response;
	}

	async deleteOneGastosOperacion(gasto:DeleteGastosOpDTO):Promise<responseInterface>
	{
		await this.callServiceCajaChica(gasto._cajachica);
		let auxCaja:CajaChica = this._Response.data;

		//sino existe dato, retorna
		if (!auxCaja) return;
		else if(auxCaja.gasto) 
		{	
			//aqui elimino el ultimo dato
			auxCaja.gasto.splice(auxCaja.gasto.length-1, 1);
		}
		await this.callServiceRefreshCajaChica(gasto._cajachica, auxCaja);
		return this._Response;
	}

}
