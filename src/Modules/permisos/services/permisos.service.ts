import { Injectable } from '@nestjs/common'
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import 
{ 
	_configPaginator, 
	_dataPaginator, 
	_argsPagination, 
	_argsUpdate
} from 'src/Response/interfaces/interfaces.index'

import 
{ 
	responseInterface, 
	_argsFind 
} from "src/Response/interfaces/interfaces.index"

import 
{ 
	ProcessDataService, 
	DateProcessService 
} from "src/Classes/classes.index" 

import
{
	Permiso,
	ObtenerModel,
	CrearModel,
	ModificarModel,
	EliminarModel
} from '../models/schemas/permisos.schema'

import
{
	UserPermisosDTO,
	ModifyPermisosDTO
} from '../models/dto/index.dto'

@Injectable()
export class PermisoService 
{
	private _Response:responseInterface;
	private _Crear:CrearModel;
	private _Ver:ObtenerModel;
	private _Modificar:ModificarModel;
	private _Eliminar:EliminarModel;

	constructor
	(
		@InjectModel(Permiso.name) private PermisoModel:Model<Permiso>,
		private _dateProcessService:DateProcessService,
		private _processData:ProcessDataService
	){}

	async getAllPermisos(id:string): Promise<responseInterface> 
	{

	    const parameters: _dataPaginator = { // <- paginate parameters

			page: 1 || _configPaginator.page,
			limit: 12 || _configPaginator.limit,
			customLabels: _configPaginator.customLabels,
			sort: { _id: -1 },
			populate: 
			[
				{
					path: 'usuario',
					select: '-pass'
				},
			],
	    }

	    const args: _argsPagination = {

	      findObject: {enrutador: id},
	      options: parameters

	    }

	    await this._processData._findDB(this.PermisoModel, args).then(r => {
	      this._Response = r;
	    }, err => 
	    {
	      this._Response = err;
	    });

	    return this._Response;
  	}

  	async getOnePermisoByUser(id: string): Promise<responseInterface> {

	    const args: _argsFind = {
	      	findObject: {
	        	usuario: id,
	      	}/*,
	      	populate: {
					  path: 'usuario',
					  select: '-pass'
			    }*/
	    }

	    await this._processData._findOneDB(this.PermisoModel, args).then(r => 
	    {
	      this._Response = r;
	    }, err => 
	    {
	      this._Response = err;
	    });

	    return this._Response;
  	}

  	async getOnePermiso(id: string): Promise<responseInterface> {

	    const args: _argsFind = {
	      	findObject: {
	        	_id: id,
	      	},
	      	populate: {
					path: 'usuario',
					select: '-pass'
			}
	    }

	    await this._processData._findOneDB(this.PermisoModel, args).then(r => 
	    {
	      this._Response = r;
	    }, err => 
	    {
	      this._Response = err;
	    });

	    return this._Response;
  	}

  	async createNewPermisos(permisos:UserPermisosDTO): Promise<responseInterface>
  	{	
  		this._Ver = {
  			cobro: permisos.view_cobro,
  			cliente: permisos.view_cliente,
  			negocio: permisos.view_negocio,
  			rutas: permisos.view_rutas,
  		}

  		this._Crear = {
  			cobro: permisos.crear_cobro,
  			cliente: permisos.crear_cliente,
  			negocio: permisos.crear_negocio,
  			rutas: permisos.crear_rutas,
  		}

  		this._Modificar = {
  			cobro: permisos.modify_cobro,
  			cliente: permisos.modify_cliente,
  			negocio: permisos.modify_negocio,
  			rutas: permisos.modify_rutas,
  			cobrador_rutas: permisos.modify_cobrador_rutas,
  			cobrador_cliente: permisos.modify_cobrador_cliente,
  			cliente_rutas: permisos.modify_cliente_rutas
  		}

  		this._Eliminar = {
  			cobro: permisos.delete_cobro,
  			cliente: permisos.delete_cliente,
  			negocio: permisos.delete_negocio,
  			rutas: permisos.delete_rutas,
  		}

  		const data = new this.PermisoModel({
  			enrutador_id: permisos.enrutador_id,
  			usuario: permisos.usuario,
  			obtener: this._Ver,
  			crear: this._Crear,
  			modificar: this._Modificar,
  			eliminar: this._Eliminar
  		});

  		await this._processData._saveDB(data).then(r =>
        {
            this._Response = r;
        }, err =>
        {
            this._Response = err;
        }); 

  		return this._Response;
  	}

  	async modifyOnePermiso(permisos:ModifyPermisosDTO):Promise<responseInterface>
    {
        // se crea un objeto con los nuevos valores
        this._Ver = {
  			cobro: permisos.view_cobro,
  			cliente: permisos.view_cliente,
  			negocio: permisos.view_negocio,
  			rutas: permisos.view_rutas,
  		}

  		this._Crear = {
  			cobro: permisos.crear_cobro,
  			cliente: permisos.crear_cliente,
  			negocio: permisos.crear_negocio,
  			rutas: permisos.crear_rutas,
  		}

  		this._Modificar = {
  			cobro: permisos.modify_cobro,
  			cliente: permisos.modify_cliente,
  			negocio: permisos.modify_negocio,
  			rutas: permisos.modify_rutas,
  			cobrador_rutas: permisos.modify_cobrador_rutas,
  			cobrador_cliente: permisos.modify_cobrador_cliente,
  			cliente_rutas: permisos.modify_cliente_rutas
  		}

  		this._Eliminar = {
  			cobro: permisos.delete_cobro,
  			cliente: permisos.delete_cliente,
  			negocio: permisos.delete_negocio,
  			rutas: permisos.delete_rutas,
  		}

  		const data:any = {
  			obtener: this._Ver,
  			crear: this._Crear,
  			modificar: this._Modificar,
  			eliminar: this._Eliminar
  		};
        // se crea el objeto de argumentos con el id de busqueda en especifico y la data a reemplazar en set
        const args: _argsUpdate = {
            findObject: {
                _id: permisos._id,
            },
            set: {
                $set: data
            }
        }

        await this._processData._updateDB(this.PermisoModel, args).then(r => {
            this._Response = r;

        }, err => {

            this._Response = err;
        });
        return this._Response;
    }

    async deleteOnePermiso(id:string):Promise<responseInterface>
    {
    	await this._processData._deleteSoftDB(this.PermisoModel, id).then(r => 
        {

            this._Response = r;
            this._Response.message = 'Tabla de permisos eliminada';

        }, err => 
        {
            this._Response = err;

        });
    	return this._Response;
    }
}
