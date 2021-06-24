import {Injectable} from '@nestjs/common';
import {responseInterface, _configPaginator, _argsPagination, _dataPaginator, _argsUpdate} from 'src/Response/interfaces/interfaces.index';
import {ProcessDataService, DateProcessService} from 'src/Classes/classes.index';
import {InjectModel} from '@nestjs/mongoose';
import {Users} from 'src/Modules/users/models/schemas/userSchema';
import {Model} from 'mongoose';
import {Roles} from 'src/Modules/role/models/schemas/roleSchema';
import {responseChangeRoleDTO, RoleUserDto} from '../models/dto/dto.index';
import {UserDto} from 'src/Modules/users/models/dto/user.dto';

@Injectable()
export class AdminService {
    private _Response: responseInterface;

    constructor
        (
            @InjectModel(Users.name) private _usersModel: Model<Users>,
            @InjectModel(Roles.name) private _roleModel: Model<Roles>,
            private _processData: ProcessDataService,
            private _dateProcess: DateProcessService
        ) { }

    async getUsers(): Promise<responseInterface> {
        const parameters: _dataPaginator={ // <- paginate parameters

            page: 1||_configPaginator.page,
            limit: 12||_configPaginator.limit,
            customLabels: _configPaginator.customLabels,
            sort: {_id: -1},

        }

        const args: _argsPagination={

            findObject: {},
            options: parameters

        }

        await this._processData._findDB(this._usersModel, args).then(r => {
            this._Response=r;
        }, err => {
            this._Response=err;
            // this._Response.message =
        });

        return this._Response;
    }

    async getRoles(): Promise<responseInterface> {
        const parameters: _dataPaginator={ // <- paginate parameters

            page: 1||_configPaginator.page,
            limit: 12||_configPaginator.limit,
            customLabels: _configPaginator.customLabels,
            sort: {_id: -1},

        }

        const args: _argsPagination={

            findObject: {},
            options: parameters

        }

        await this._processData._findDB(this._roleModel, args).then(r => {
            this._Response=r;
        }, err => {
            this._Response=err;
            // this._Response.message =
        });

        return this._Response;
    }

    async setRoleUser(user: RoleUserDto, id: string): Promise<responseInterface> {
        // se crea un objeto con los nuevos valores
        // rol: value._id,
        // enrouter: this.enrutadorSelected,
        // type: 'asignEnrouter'
        let data = null;
        if (user.type!=null && user.type=='asignEnrouter') {


            const l: responseChangeRoleDTO=
            {
                rol: user.rol,
                updatedAt: this._dateProcess.setDate(),
                enrutator_id: user.enrouter,
            }
            data = l;

        } else {


            const l: responseChangeRoleDTO=
            {
                rol: user.rol,
                updatedAt: this._dateProcess.setDate(),
                enrutator_id: null
            }
            data = l;

        }

        // se crea el objeto de argumentos con el id de busqueda en especifico y la data a reemplazar en set
        const args: _argsUpdate={
            findObject: {
                _id: id,
            },
            set: {
                $set: data
            }
        }

        await this._processData._updateDB(this._usersModel, args).then(r => {
            this._Response=r;

            this._Response.message='Nuevo rol cambiado';

        }, err => {
            this._Response=err;

            this._Response.data=null;
        });


        return this._Response;
    }

    /*
    async generarRegistro(body:ReferenciaDto):Promise<responseInterface>
    {
        let url:string = body.url+"confirmar/ref="+body.idAdmin+"/rol="+body.rol;
        this._Response.status = 200;
        this._Response.data = url;

        return this._Response;
    }

    async confirmarRegistro(params:string[], body:UserDto):Promise<responseInterface>
    {
        this._Response.status = 200;
        this._Response.data = params;

        return this._Response;
    }
    */
}
