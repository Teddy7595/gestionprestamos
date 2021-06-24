import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {DateProcessService, ProcessDataService} from 'src/Classes/classes.index';
import {Cliente} from 'src/Modules/clientes/models/schemas/cliente.schema';
import {Negocio} from 'src/Modules/clientes/models/schemas/negocio.schema';
// import {Cliente} from 'src/Modules/clientes/models/schemas/cliente.schema';
import {Ruta} from 'src/Modules/enrutador/models/schemas/ruta.schema';
import {Users} from 'src/Modules/users/models/schemas/userSchema';
import {responseInterface, _argsFind, _argsPagination, _argsUpdate, _configPaginator, _dataPaginator} from 'src/Response/interfaces/interfaces.index';
import {_argsPaginationAggregate, _dataPaginatorAggregate} from 'src/Response/interfaces/responsePaginator.interface';


import * as Mongoose from "mongoose";

@Injectable()
export class CobradorService {
    private _Response: responseInterface;

    constructor
        (
            // @InjectModel(Cliente.name) private ClientesModel: Model<Cliente>,
            @InjectModel(Ruta.name) private RutaModel: Model<Ruta>,
            @InjectModel(Users.name) private UsersModel: Model<Users>,
            @InjectModel(Negocio.name) private NegocioModel:Model<Negocio>,
            private _processData: ProcessDataService,
            private _dateProcessService: DateProcessService
        ) { }


    async getCollectorsByEnrouter(page, id: string): Promise<responseInterface> {

        // const parameters: _dataPaginator={ // <- paginate parameters

        //     page: page||_configPaginator.page,
        //     limit: 12||_configPaginator.limit,
        //     customLabels: _configPaginator.customLabels,
        //     sort: {_id: -1},
        //     populate: [
        //         {
        //             path: 'rol',
        //             select: 'rol alias'
        //         },

        //     ],
        //     select: '-pass'
        // }

        // const args: _argsPagination={

        //     findObject: {
        //         enrutator_id: id
        //     },
        //     options: parameters

        // }
        // await this._processData._findDB(this.UsersModel, args).then(async (r: responseInterface) => {


        const agg = [
            {
                // <- Esto funciona como un WHERE, se especifican los detalles para buscar un registro
                $match: {
                    enrutator_id: id
                }
            },
            {
                // <- Esto funciona para esteblecer uniones entre otras tablas, también se hacen Inner Joins con esto.
                $lookup: {
                    from: 'roles', // <- Se especifica la otra tabla o coleccion a la que se busca

                    // RELACIONAMIENTO FORANEO VS LOCAL SIN USAR PIPELINE
                    // ESTA ES LA FORMA DIRECTA DE TRAER OTRA TABLA MEDIANTE RELACIÓN
                    // localField: 'rol',
                    // foreignField: '_id',
                    // OJO <- NO FUNCIONA SI SE USA PIPELINE,

                    // RELACIONAMIENTO USANDO PIPELINE
                    let: { //  Se declaran variables internas que determinen las variables a relacionar
                        'local_foreig': '$rol'
                    },
                    // El pipeline se usa para ejecutar una  sub consulta  dentro del relacionamiento en $lookup
                    // por ejemplo es como cuando en SQL se usa algo asi
                    // SELECT * FROM CULO  WHERE VAGINA=(SELECT * FROM VAGINA)
                    pipeline: [
                        {
                            $match: {
                                $expr: { // acá le digo que me traiga los registros que sean iguales entre el _id de la tabla foranea vs la variable local que ya se definio antes en let $$local_foreig
                                    $eq: [ '$_id', '$$local_foreig' ]
                                }
                            }
                        },
                        {
                            $project: { // Acá le especifico que solo me traiga estos campos eligiendo de manera booleana solo los que quiero, 1 traemelo 0 no lo traigas
                                'rol': 1,
                                'alias': 1
                            }
                        }
                    ],
                    // Acá le pido que me ponga el resultado de esta relación/subconsulta dentro de la variable rol
                    as: 'rol',
                }
            },
            {
                // con esto convierto el registro rol en un objeto ya que el $lookup retorna resultados dentro de un array[], pero como solo recibo un solo resultado y me interesa es solo ese resultado, lo convierto en objeto.
                $unwind: '$rol'
            },
            {
                // hago busqueda relacionada en la tabla de negocios para consultar si el vendedor tiene clientes
                $lookup: {
                    from: 'negocios',
                    as: 'clientes', //en lugar de llamar al registro negocios, lo llamo clientes, esto a conveniencia de lo siguiente que mostraré

                    let: {
                        'local_foreig': '$_id' // establezco variable para relacionar
                    },
                    pipeline: [
                        {
                            $match: { //pido que me traiga valores que sean iguales a la relación de id del vendedor
                                $expr: {
                                    $eq: [ '$cobrador_id', '$$local_foreig' ]
                                }
                            }
                        },
                        {
                            $group: { //agrupo los registros en sumatoria para solo tener la cantidad de resultados ignorando todos los demás datos
                                _id: null,
                                clientes: {
                                    $sum: 1

                                }

                            }
                        },
                        {
                            $project: { //evito que mongo coloqué el parametro id en los resultados de clientes
                                _id: 0,

                            },
                        },


                    ],



                }
            },
            {
                $unwind : { //convierto el array de clientes a objeto, puesto lo unico que me interesa es contar cuantos clientes tengo..
                    path: "$clientes",
                    preserveNullAndEmptyArrays: true //<- con esto le digo que si el elemento no tiene resultados entonces que no lo ponga
                }
            },

            {
                $addFields: { //con esto convierto a conveniencia el parametro clientes a una variable tipo clientes: 1 o clientes: 0 o clientes: 3 para que solo sea una variable individual.
                    clientes: {
                        $cond: [ //en esta condicional le digo que si clientes.clientes no existe entonces que le ponga un 0, para esto llamé la tabla negocios -> clientes (lo que mencioné de mi conveniencia)
                            {
                                "$ifNull": [
                                    "$clientes.clientes",
                                    false
                                ]
                            },
                            "$clientes.clientes",
                            0
                        ]
                    }
                 }
            }



        ]

        const aggOptions: _dataPaginatorAggregate = {
            pagination: false,
            page: page||_configPaginator.page,
            limit: 12||_configPaginator.limit,
            customLabels: _configPaginator.customLabels,
        }

        const args: _argsPaginationAggregate = {
            aggregate: agg,
            options: aggOptions
        }
        await this._processData._findDBAggregate(this.UsersModel, args).then(async (r: responseInterface) => {

            let l: responseInterface = r;

            // await this.getNumberClients(r.data).then(xx => {

            //     console.log('respuesta ', xx);
            //     l.data = xx;

            // });


            this._Response = l;


        }, (err: responseInterface) => {
            this._Response=err;
            // this._Response.message =
        });

        console.log('return final', this._Response);

        return this._Response;

    }


    getNumberClients(cobradores: any = null){

        return new Promise( async (resolve, reject) => {

            if(cobradores != null && cobradores.length > 0 ){

                let aux = cobradores;

                let cont = 0;

                while ( cont < cobradores.length ) {


                    // await cobradores.forEach(async (ele, idx) => {

                        let x = null;
                        let arg: _argsFind = {
                        findObject: {
                            cobrador_id: cobradores[cont]._id
                        },
                        populate: [
                            {
                                path: 'cliente_id',
                                model: 'Cliente',
                                select: ''

                            },
                        ]
                    }

                    await this._processData._findAllDB(this.NegocioModel, arg).then( (rr: responseInterface) => {

                        let j = rr.data;

                        try {

                            if( j.length > 0 ){

                                x = j.length;

                            }else{
                                x = 0;
                            }

                        } catch (error) {

                            x = 0;

                        }

                        let o = {
                            nro_clientes: x
                        };

                        // cobradores[idx].nro_clientes = x;

                        aux[cont] = this._processData.addToObject(cobradores[cont], o);
                        // aux[cont] = aux[cont].Promise;
                        console.log('iteracion ' + cont, aux[cont]);


                        cont++;

                    }, ERR => {

                    });



                }

                // });
                console.log('paquete que retorna', aux);
            resolve(aux);
            }else{

                reject(false);

            }

        });

    }


    // async getOneRoute(cobrador): Promise<responseInterface> {

    //     const args: _argsFind =
    //     {
    //         findObject:
    //         {
    //             _id:ruta,
    //             enrutador_id:enrutador,
    //         },
    //         // populate: "clientes_id"
    //         populate: {

    //             path: 'negocios_id',
    //             model: 'Negocio', // <- si es un array de ids se debe especificar el model
    //             populate: [
    //                 {
    //                     path: 'cliente_id',
    //                     model: 'Cliente',
    //                     select: "",
    //                 },
    //                 {
    //                     path: 'cobrador_id',
    //                     select: '-pass',
    //                     populate: {
    //                         path: 'rol',
    //                         select: 'rol alias',
    //                     }
    //                 }
    //             ]

    //         }

    //     }

    //     await this._processData._findOneDB(this.RutaModel, args).then(r =>
    //     {
    //         this._Response = r;
    //         console.log('r.data respuesta', r.data);
    //     }, err =>
    //     {
    //         this._Response = err;
    //     });

    //     console.log(enrutador, ruta);
    //     return this._Response;

    // }


    async getAllRoutes(page, cobradorId:string):Promise<responseInterface>
    {


        const args: _argsFind={
            findObject: {
                // cobrador_id: element._id,
            },
            // populate: null
             populate: {

                path: 'negocios_id',
                model: 'Negocio', // <- si es un array de ids se debe especificar el model
                populate: [

                            {
                                path: 'cliente_id',
                                model: 'Cliente',
                                select: ''

                            },
                            {
                                path: 'cobrador_id',
                                model: 'Users',
                                select: '-pass'

                            },


                ]

            }
            // select: "rol"
        }


        await this._processData._findAllDB(this.RutaModel, args).then(async (r: responseInterface) => {
            this._Response=r;

            let x = r.data;

        	let datos = await x.filter( (r) => {

                let dato = r;
                let pasa:boolean = false;

                r.negocios_id.forEach( (element, idx)  => {



                    if(String(element.cobrador_id._id) == String(cobradorId)){


                        console.log('iguales');
                        pasa = true;

                    }

                });

                if(pasa != false){


                    return r;

                }




            });

            console.log('datos', datos);

            this._Response.data = datos;


        }, (err: responseInterface) => {
            this._Response=err;
            // this._Response.message =
        });

        return this._Response;

        // const parameters: _dataPaginator =
        // {
        //     page: page || _configPaginator.page,
        //     limit: 12 || _configPaginator.limit,
        //     customLabels: _configPaginator.customLabels,
        //     sort: { _id: -1 },
        //     // populate: {

        //     //     path: 'negocios_id',
        //     //     model: 'Negocio', // <- si es un array de ids se debe especificar el model
        //     //     populate: [
        //     //         {
        //     //             path: 'cliente_id',
        //     //             model: 'Cliente',
        //     //             select: "",
        //     //         },
        //     //         // {
        //     //         //     path: 'cobrador_id',
        //     //         //     select: '-pass',
        //     //         //     populate: {
        //     //         //         path: 'rol',
        //     //         //         select: 'rol alias',
        //     //         //     }
        //     //         // }
        //     //     ]

        //     // }

        // }

        // const args: _argsPaginationAggregate =
        // {
        //     aggregate: [
        //         {
        //             $lookup:{
        //                 from: "negocios",
        //                 // localField : "negocios_id",
        //                 // foreignField : "_id",
        //                 let: {

        //                     "cobradorId": cobradorId,

        //                     "negocios_id": "$negocios_id"
        //                 },

        //                 pipeline: [

        //                     {
        //                         "$match": {
        //                         "$expr": {
        //                           "$and": [
        //                               { "$in": ["$_id", "$$negocios_id"] },
        //                             //   { "$eq": ["$ncuotas", 20 ] }
        //                           ]
        //                         }
        //                         }
        //                     }

        //                 ],

        //                 as : "negocios_id",
        //             },
        //         },
        //         // {
        //         //     $unwind:{
        //         //         preserveNullAndEmptyArrays : true, // this remove the object which is null
        //         //         path : "$negocios_id"
        //         //     }
        //         // },
        //         // {
        //         //     $match:{
        //         //         "$negocios_id": { "$in": [ cobradorId ] },
        //         //     }
        //         // },



        //     ],
        //     options: parameters
        // }

        // console.log('args aggregate', args);
        // console.log('id cobrador', cobradorId);



        // await this._processData._findDBAggregate(this.RutaModel, args).then((r: responseInterface) =>
        // {
        //     this._Response = r;
        //     this._Response.message = 'Rutas encontradas'

        // }, (err: responseInterface) =>
        // {


        //     this._Response = err;
        //     this._Response.message = err.message || 'Algo ha salido mal, intente más tarde'

        // });

        // return this._Response;
    }


    async setCollectorsAreas(collection: any , data: any[]) {


        return new Promise(async (resolve, reject) => {

            let x: any= data;
            await data.forEach(async (element, idx) => {


                const args: _argsFind={
                    findObject: {
                        cobrador_id: element._id,
                    },
                    populate: null
                    // select: "rol"
                }

                await this._processData._findAllDB(collection, args).then((r: responseInterface) => {

                    if (r.data!=null && r.data.length>0) {
                        x[idx]["clientesAsignados"].push({aaa: 'sss'});
                    }

                }, (err: responseInterface) => {

                });

            });

            resolve(x);

        });



        }


        async getOneRoute(cobrador:string, ruta:string):Promise<responseInterface>
        {

            const args: _argsFind =
            {
                findObject:
                {
                    _id:ruta,
                    // enrutador_id:enrutador,
                },
                // populate: "clientes_id"
                populate: [{

                    path: 'negocios_id',
                    model: 'Negocio', // <- si es un array de ids se debe especificar el model
                    populate: [
                        {
                            path: 'cliente_id',
                            model: 'Cliente',
                            select: "",
                        },
                        {
                            path: 'cobrador_id',
                            model: 'Users',
                            select: '-pass',
                            populate: {
                                path: 'rol',
                                select: 'rol alias',
                            }
                        }
                    ]

                },
                {
                    path: 'enrutador_id',
                    model: 'Users',
                    select: '-pass',
                    populate: {
                        path: 'rol',
                        select: 'rol alias',
                    }

                }
            ]

            }

            await this._processData._findOneDB(this.RutaModel, args).then(async (resp: responseInterface) =>
            {
                // console.log('r.data respuesta', r.data);

                this._Response = resp;


                // let x = new Promise((resolve, reject) => {

                    this._Response.data.negocios_id.forEach( (element,idx)  => {

                        if( String(element.cobrador_id._id) != String(cobrador) ){
                        console.log(' element._id ',element._id);
                        console.log(' cobrador); ',cobrador);


                            this._Response.data.negocios_id.splice(idx, 1);

                        }


                    });


                //     resolve(true);

                // })

                // await x.then( r => {

                // });


            }, err =>
            {
                this._Response = err;
            });

            // console.log(enrutador, ruta);
            return this._Response;
        }



}
