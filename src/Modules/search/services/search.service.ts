import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ProcessDataService, DateProcessService} from 'src/Classes/classes.index';
import {Ruta} from 'src/Modules/enrutador/models/schemas/ruta.schema';
import {Users} from 'src/Modules/users/models/schemas/userSchema';
import {responseInterface, _argsPagination, _configPaginator, _dataPaginator} from 'src/Response/interfaces/interfaces.index';
import {_argsFindByText} from 'src/Response/interfaces/responseFindParameters.interface';

@Injectable()
export class SearchService {


    _Response: responseInterface;

    constructor
        (

            @InjectModel(Users.name) private UsersModel: Model<Users>,
            @InjectModel(Ruta.name) private RutaModel:Model<Ruta>,
            private _processData: ProcessDataService,
            private _dateProcessService: DateProcessService,

    ) { }

    async searchGetUser(arg: string): Promise<responseInterface> {


        const args: _argsFindByText={
            arg: arg,
            findObject: {

            },
            populate: [
                {
                    path: 'rol',
                    select: 'alias rol'
                },
            ],
            select: "-pass"

        }

        await this._processData._searchByText(this.UsersModel, args).then( (r:responseInterface) => {
            this._Response=r;
            this._Response.message = 'Resultados encontrados'
        }, (err: responseInterface) => {
            this._Response=err;
            this._Response.message = err.message || 'Sin resultados encontrados';
        });

        return this._Response;


    }

    async searchGetUserEnrrouter(arg: string): Promise<responseInterface> {


        const args: _argsFindByText={
            arg: arg,
            findObject: {
                "rol": '5f85943b2675cb18ec300164'
            },
            populate: [
                {
                    path: 'rol',
                    select: 'alias rol'
                },
            ],
            select: "-pass"

        }

        await this._processData._searchByText(this.UsersModel, args).then( (r:responseInterface) => {
            this._Response=r;
            this._Response.message = 'Resultados encontrados'
        }, (err: responseInterface) => {
            this._Response=err;
            this._Response.message = err.message || 'Sin resultados encontrados';
        });

        return this._Response;


    }



    async getCollectorsByEnrouter(arg: string, id: string): Promise<responseInterface> {



        const args: _argsFindByText={
            arg: arg,
            findObject: {
                enrutator_id: id
            },
            populate: [
                {
                    path: 'rol',
                    select: 'alias rol'
                },
            ],
            select: "-pass"

        }


        await this._processData._searchByText(this.UsersModel, args).then( async (r: responseInterface) => {
            this._Response=r;
            this._Response.message = 'Resultados encontrados'
        }, (err: responseInterface) => {
            this._Response=err;
            this._Response.message = err.message || 'Sin resultados encontrados';
        });

        return this._Response;

    }

    async searchMyRoutesEnrouter(arg: string, id: string): Promise<responseInterface> {



        const args: _argsFindByText={
            arg: arg,
            findObject: {
                enrutador_id: id
            },
            populate: {
                path: 'clientes_id',
                // select: '-pass'
              },
              select: null

        }



        await this._processData._searchByText(this.RutaModel, args).then( async (r: responseInterface) => {
            this._Response=r;
            this._Response.message = 'Resultados encontrados'
        }, (err: responseInterface) => {
            this._Response=err;
            this._Response.message = err.message || 'Sin resultados encontrados';
        });

        return this._Response;

    }





}
