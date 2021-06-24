import {
  Injectable

} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DateProcessService, ProcessDataService } from 'src/Classes/classes.index';

import { responseInterface ,_configPaginator, _dataPaginator, _argsPagination, _argsFind, _argsUpdate} from 'src/Response/interfaces/interfaces.index';
import {  responseRolesDto, RolesDto } from '../models/dto/dto.index';

import { Roles } from '../models/schemas/roleSchema';

@Injectable()
export class RoleService {

   _Response: responseInterface;

  constructor(
    @InjectModel(Roles.name) private RolesModel: Model<Roles>,
    private _processData: ProcessDataService,
    private _dateProcessService: DateProcessService

  ) {}

  async get(id: string): Promise<responseInterface> {

    const args: _argsFind = {
      findObject: {
        _id: id,
      },
      populate: null
      // select: "rol"
    }

    await this._processData._findOneDB(this.RolesModel, args).then(r => {
      this._Response = r;
    }, err => {
      this._Response = err;
    });

    return this._Response;
  }

  async getAll(): Promise<responseInterface> {


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

    await this._processData._findDB(this.RolesModel, args).then(r => {
      this._Response = r;
    }, err => {
      this._Response = err;
    });

    return this._Response;

  }

  async create(role: Roles): Promise<responseInterface> {


    const data = new this.RolesModel(role);

    await this._processData._saveDB(data).then(r => {
      this._Response = r;
    }, err => {
      this._Response = err;
    });
    return this._Response;

  }

  async update(id: string, body: RolesDto): Promise<responseInterface> {

    // se crea un objeto con los nuevos valores
    const data: responseRolesDto = {
      alias: body.alias,
      description: body.description,
      status: body.status,
      updatedAt: this._dateProcessService.setDate()
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
    await this._processData._updateDB(this.RolesModel, args).then(r  => {

      this._Response = r;
      this._Response.message = 'Rol actualizado';

    }, err => {
      this._Response = err;
    });
    return this._Response;

  }

  async delete(id: string): Promise<responseInterface> {

    await this._processData._deleteSoftDB(this.RolesModel, id ).then(r  => {

      this._Response = r;
      this._Response.message = 'Rol eliminado';

    }, err => {
      this._Response = err;
    });
    return this._Response;

  }
}
