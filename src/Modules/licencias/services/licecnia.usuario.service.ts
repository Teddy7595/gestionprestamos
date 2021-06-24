import { Injectable, Logger } from '@nestjs/common';
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
    _argsFind, 
    _configPaginator, 
    _dataPaginator, 
    _argsPagination, 
    _argsUpdate
} 
from 'src/Response/interfaces/interfaces.index';
import 
{
    setLicenciaUserDto,
    modifyUserLicenciaDto
} from '../models/dto/dto.index';
import {LicenciaUsuario} from '../models/schemas/index.schema';
import {Cron, CronExpression} from '@nestjs/schedule';
import {UsersService} from '../../users/services/services.index';
import { STATUS } from "../models/enums/enum.index";

@Injectable()
export class LicecniaUsuarioService
{ 
    private _Response: responseInterface;
    private readonly logger = new Logger("Centinala diario");
    private userLicense:Array<LicenciaUsuario> = Array();

    constructor
    (
        @InjectModel(LicenciaUsuario.name) private _licenciaUsuarioModel:Model<LicenciaUsuario>,
        private _processData:ProcessDataService,
        private _dateService: DateProcessService,
        private readonly _userServiceControl:UsersService
    ) 
    {
        //this.getALLInternalLicencias();
    }

    //reloj de sistema para las licecnias
    //("00 30 2 */1 * *")
    
    @Cron('00 30 2 */1 * *',
    {
        name: "Lincense_time" 
    })
    private async handleCron()
    {
        
        await this.getALLInternalLicencias();
        await this.modifyAllInternalLicense();
        //this.logger.debug(this.userLicense);

    }

    //funcion para obtener todas las licencias
    private async getALLInternalLicencias():Promise<responseInterface>
    {
        const parameters:any = { }

        const args: _argsPagination = 
        {
          findObject: {},
          options: parameters 
        }
        this._Response = await this._processData._findAllDB(this._licenciaUsuarioModel, args);
        return this._Response;
    }

    //funcion que modifica todas las licencias obtenidas y llama a modificar al usuario si dicha licencia ya esta vencida
    private async modifyAllInternalLicense():Promise<Array<LicenciaUsuario>>
    {
        this.userLicense = this._Response.data;
        await this.userLicense.forEach((lcUs,index) =>
        {
            lcUs.dias = lcUs.dias -1; 
            (lcUs.status === STATUS.INDEFINIDO)? lcUs.dias = 1 : false;
            (lcUs.status === STATUS.CADUCADO)?   lcUs.dias = 0 : false;
            (lcUs.status === STATUS.CANCELADA)?  lcUs.dias = 0 : false;
            (lcUs.dias <= 0)? lcUs.dias = 0 : false;
            (lcUs.dias <= 0)? this.modifyUserByUser(lcUs.usuario, STATUS.INACTIVE) : false;
            (lcUs.dias <= 0)? this.modifyOneLicense({_id:lcUs._id, status: STATUS.CADUCADO, dias: lcUs.dias }) : false;
            (lcUs.dias >  0)? this.modifyOneLicense({_id:lcUs._id, status: STATUS.VIGENTE, dias: lcUs.dias }) : false;
        });

        return this.userLicense;
    }

    //función que modifica el status si el usuario puede o no entrar
    async modifyUserByUser(id:string, status:STATUS):Promise<responseInterface>
    {
        this._Response = await this._userServiceControl.modifyActiveUser(status, id);
        return this._Response;
    }

    //me retorna todas las licencias de una usuario
    async getAllLicenseByUser(id:string): Promise<responseInterface> 
    {

        const parameters: _dataPaginator = { // <- paginate parameters

              page: 1 || _configPaginator.page,
              limit: 12 || _configPaginator.limit,
              customLabels: _configPaginator.customLabels,
              sort: { _id: -1 },
              populate: [
                {
                    path: 'usuario',
                    select: '-pass',
                    populate: {
                        path: 'rol',
                        select: 'alias'
                    }
                }
            ],
        }

        const args: _argsPagination = {

          findObject: {usuario:id},
          options: parameters

        }

        await this._processData._findDB(this._licenciaUsuarioModel, args).then(r => 
        {
          this._Response = r;
        }, err => 
        {
          this._Response = err;
        });

        return this._Response;
    }

    //me retorna una licencia en particular dependiendo del usuario
    async getOneLicense(usuario_id: string, licencia_id:string): Promise<responseInterface> 
    {
        const args: _argsFind = 
        {
          findObject: { usuario: usuario_id, _id: licencia_id},
          populate: 
          [
              {
                path: 'usuario',
                select: '-pass',
                populate: {
                    path: 'rol',
                    select: 'alias'
                }
            }
          ]
        }

        await this._processData._findOneDB(this._licenciaUsuarioModel, args).then(r => 
        {
          this._Response = r;
        }, err => 
        {
          this._Response = err;
        });

        return this._Response;
    }

    async setUserNewLicencia(licencia:setLicenciaUserDto): Promise<responseInterface>
    {
        //licencia.dias = licencia.dias +1;
        const data = new this._licenciaUsuarioModel(licencia);

        await this._processData._saveDB(data).then(r =>
        {
            this._Response = r;
        }, err =>
        {
            this._Response = err;
        }); 
 
        return this._Response;
    }

    async modifyOneLicense(licencia:modifyUserLicenciaDto):Promise<responseInterface>
    {
        // se crea un objeto con los nuevos valores
        const data = 
        {
            dias: licencia.dias,
            status: licencia.status,
            updatedAt: this._dateService.setDate(), 
        }

        // se crea el objeto de argumentos con el id de busqueda en especifico y la data a reemplazar en set
        const args: _argsUpdate = {
          findObject: {
            _id: licencia._id,
          },
          set: {
            $set: data
          },
          populate: {
            path: 'usuario',
            select: '-pass'
          }
        }

        await this._processData._updateDB(this._licenciaUsuarioModel, args).then( async r => {

          this._Response = r;
          this._Response.message = 'Licencia actualizada!';

        }, err => 
        {
          this._Response = err;
        });
        return this._Response;
    }

    async deleteLicenseByID(id:string):Promise<responseInterface>
    {
        await this._processData._deleteSoftDB(this._licenciaUsuarioModel, id ).then(r  => {

          this._Response = r;
          this._Response.message = 'Licencia eliminada';

        }, err => {
          this._Response = err;
        });

        return this._Response;
    }
}
