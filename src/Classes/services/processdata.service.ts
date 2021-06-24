import { Injectable } from "@nestjs/common";

import { responseInterface, _argsFind, _argsPagination, _argsUpdate } from "src/Response/interfaces/interfaces.index";
import {_argsFindByText} from "src/Response/interfaces/responseFindParameters.interface";
import {_argsPaginationAggregate} from "src/Response/interfaces/responsePaginator.interface";
import { DateProcessService } from "../classes.index";

@Injectable()
export class ProcessDataService {
  constructor(
    private _dateProcessService: DateProcessService
  ){

  }

  async _findDB(dataBody: any, parameters: _argsPagination = null): Promise<responseInterface> {

    return new Promise(async (resolve, reject) => {

    await dataBody.paginate(
      parameters.findObject,
			parameters.options,
			(error, response) => {

				if (error) {

          const resp: responseInterface = {
            ok: false,
            status: 500,
            message: 'Algo ha salido mal, intente más tarde',
            err: error,
          };
          console.log('el error este', error);
          reject(resp);

        }

        // console.log('el retorno aca', response);

        // console.log('response', response);
        if(!response){

          const resp: responseInterface = {
            ok: false,
            status: 404,
            message: 'No hay resultados en este momento',
            data: []

          };
          reject(resp);

        }


        const resp: responseInterface = {
          ok: true,
          status: 200,
          data: response.itemsList,
          paginator: response.paginator
        };
        resolve(resp);

    	});

    });
  }

  // async _findDBAllAggregate(dataBody: any, parameters: _argsPaginationAggregate = null): Promise<responseInterface> {

  //   return new Promise(async (resolve, reject) => {


  //     const myAggregate = dataBody.aggregate(
  //       parameters.aggregate
  //     );

  //     });

  // }

  async _findDBAggregate(dataBody: any, parameters: _argsPaginationAggregate = null): Promise<responseInterface> {

    return new Promise(async (resolve, reject) => {


    const myAggregate = dataBody.aggregate(
      parameters.aggregate
    );

    await dataBody.aggregatePaginate(
      myAggregate,
			parameters.options,
			(error, response) => {

				if (error) {

          const resp: responseInterface = {
            ok: false,
            status: 500,
            message: 'Algo ha salido mal, intente más tarde',
            err: error,
          };
          console.log('el error este', error);
          reject(resp);

        }


        // console.log('response', response);
        if(!response){

          const resp: responseInterface = {
            ok: false,
            status: 404,
            message: 'No hay resultados en este momento',
            data: []

          };
          reject(resp);

        }

          console.log('consulta con aggregate', response);

        let paginatorMeta = {
          itemCount: response.itemCount,
          perPage: response.perPage,
          currentPage: response.currentPage,
          pageCount: response.pageCount,
          pageCounter: response.pageCounter,
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          prev: response.prev,
          next: response.next,
        }

        const resp: responseInterface = {
          ok: true,
          status: 200,
          data: response.itemsList,
          paginator: paginatorMeta
        };
        resolve(resp);

    	});

    });
  }

  async _findOneDB( dataBody: any, parameters: _argsFind ): Promise<responseInterface> {

    // console.log('llega al findone', parameters);
    return new Promise(async (resolve, reject) => {

      await dataBody.findOne(parameters.findObject)
      .populate(parameters.populate)
      .select(parameters.select)
      .exec((error, response) => {

        if(error){
          //console.log('hubo error', error);
          const resp: responseInterface = {
            ok: false,
            status: 500,
            message: 'Algo ha salido mal, intente más tarde',
            err: error,
          };
          reject(resp);
        }

        if(!response){
          //console.log('inexistente');
          const resp: responseInterface = {
            ok: false,
            status: 404
          };
          reject(resp);
        }
        //console.log('consulta realizada', response);
          const resp: responseInterface = {
            ok: true,
            status: 200,
            data: response,
          };
          resolve(resp);


    });

    });
  }

  async _findAllDB( dataBody: any, parameters: _argsFind ): Promise<responseInterface> {

    // console.log('llega al findone', parameters);
    return new Promise(async (resolve, reject) => {

      await dataBody.find(parameters.findObject)
      .populate(parameters.populate)
      .select(parameters.select)
      .exec((error, response) => {

        if(error){
          //console.log('hubo error', error);
          const resp: responseInterface = {
            ok: false,
            status: 500,
            message: 'Algo ha salido mal, intente más tarde',
            err: error,
          };
          reject(resp);
        }

        if(!response){
          //console.log('inexistente');
          const resp: responseInterface = {
            ok: false,
            status: 404,
            data: []
          };
          reject(resp);
        }
        // console.log('respuesta petición', response);
          const resp: responseInterface = {
            ok: true,
            status: 200,
            data: response,
          };
          resolve(resp);


    });

    });
  }

  async _saveDB(dataBody: any): Promise<responseInterface> {
    return new Promise(async (resolve, reject) => {

      //console.log('DATA', dataBody);

      dataBody.save((err, response) => {
        if (err) {
          //if exists problem for update user, return sttus 400

          const resp: responseInterface = {
            ok: false,
            status: 400,
            err: err,
            message: 'Algo ha salido mal, intente más tarde'

          };
          console.log('ERRORR', err);

          reject(resp);

        }
        if(response){

          const resp: responseInterface = {
            ok: true,
            status: 201,
            data: response,
          };
          resolve(resp);

        }

      });


    });
  }

  async _updateDB(dataBody: any, parameters: _argsUpdate): Promise<responseInterface> {
    return new Promise(async (resolve, reject) => {


      await dataBody.findOneAndUpdate(
				parameters.findObject,
				parameters.set,
				{ new: true }, async (error, response) => {

					if (error) {
            console.log('hubo error', error);
            const resp: responseInterface = {
              ok: false,
              status: 500,
              message: 'Algo ha salido mal, intente más tarde',
              err: error,
            };
            reject(resp);
					}

					if (!response) {
					  const resp: responseInterface = {
              ok: true,
              status: 404,

              // data: r,
            };
            reject(resp);
					}
          const resp: responseInterface = {
            ok: true,
            status: 200,
            data: response
          };
          resolve(resp);

				}).populate(parameters.populate);


    });
  }

  async _updateManyDB(dataBody: any, parameters: _argsUpdate): Promise<responseInterface> {
    return new Promise(async (resolve, reject) => {

      await dataBody.updateMany(
				parameters.findObject,
				parameters.set,
				{ new: true }, async (error, response) => {

					if (error) {
            console.log('hubo error', error);
            const resp: responseInterface = {
              ok: false,
              status: 500,
              message: 'Algo ha salido mal, intente más tarde',
              err: error,
            };
            reject(resp);
					}

					if (!response) {
					  const resp: responseInterface = {
              ok: true,
              status: 404,

              // data: r,
            };
            reject(resp);
					}
          const resp: responseInterface = {
            ok: true,
            status: 200,
            data: response,
          };
          resolve(resp);

				});


    });
  }



   async objectContains(obj, term: string) {


    // console.log('el ter', term);
    let o: string = JSON.stringify(obj);
    let r: any = null;
    await this.diacriticSensitiveRegex(term).then(resp => {

      r = resp;
    });
    let regex = new RegExp(r, "i");
    // console.log('resp', r);

        // console.log('regex', regex);
    if( regex.test(o) ){
      return true;
    }else{
      return false;
    }


  }


  async findAllText(registros: any, arg: string){

    return new Promise(async (resolve,reject) =>{

      // let busqueda = { $regex: this.diacriticSensitiveRegex(arg), $options: 'i' }

      // console.log('this.diacriticSensitiveRegex(arg)', this.diacriticSensitiveRegex(arg));

      let regs = [];
      let x = new Promise(async (resolve, reject) => {

        await registros.forEach(async (element, idx) => {


          // console.log('el elemento la cosa', element);

          if(  await this.objectContains( element, arg ) == true ){

            regs.push(element);

          }

        });


        resolve(true);


      });

      await x.then();


      if(regs.length > 0){
        resolve(regs);
      }else{
        reject(regs);
      }

    });

  }

  async _searchByText(dataBody: any, parameters: _argsFindByText): Promise<responseInterface> {

    return new Promise(async (resolve, reject) => {

      await dataBody.find(parameters.findObject)
      .populate(parameters.populate)
      .select(parameters.select)
      .exec(async (error, response) => {

        if(error){
          console.log('hubo error', error);
          const resp: responseInterface = {
            ok: false,
            status: 500,
            message: 'Algo ha salido mal, intente más tarde',
            err: error,
          };
          reject(resp);
        }

        if(!response){
          console.log('inexistente');
          const resp: responseInterface = {
            ok: false,
            status: 404
          };
          reject(resp);
        }

        await this.findAllText( response, parameters.arg ).then( r => {

          const resp: responseInterface = {
            ok: true,
            status: 200,
            data: r,
          };
          resolve(resp);

        }, err => {

          const resp: responseInterface = {
            ok: false,
            status: 404,
            data: []
          };
          reject(resp);

        })




      });



    })

  }


  async _deleteSoftDB(dataBody: any, id: string): Promise<responseInterface> {
    return new Promise(async (resolve, reject) => {


      await dataBody.findOneAndUpdate(
				{_id: id},
        { $set: {
          updatedAt: this._dateProcessService.setDate()
        }},
				{ new: true }, async (error, response) => {

          if (error) {
            console.log('hubo error', error);
            const resp: responseInterface = {
              ok: false,
              status: 500,
              message: 'Algo ha salido mal, intente más tarde',
              err: error,
            };
            reject(resp);
					}

					if (!response) {
					  const resp: responseInterface = {
              ok: true,
              status: 404,

            };
            reject(resp);
          }

          if(response){

            await dataBody.delete({
              _id: id
            }).exec(function (error, response) {
              if (error) {
                console.log('hubo error', error);
                const resp: responseInterface = {
                  ok: false,
                  status: 500,
                  message: 'Algo ha salido mal, intente más tarde',
                  err: error,
                };
                reject(resp);
              }
              if (!response) {
                const resp: responseInterface = {
                  ok: true,
                  status: 400,

                };
                reject(resp);
              }

              const resp: responseInterface = {
                ok: true,
                status: 200,

              };
              resolve(resp);



             });

          }

        });



    });
  }


  async addToObject(objeto, elemento){

    // let o = objeto;

    let o = JSON.stringify(objeto);
    o = JSON.parse(o);

    // console.log('aaa', Object.assign(o, elemento));

    return Object.assign(o, elemento);


  }


  // async addToObject (object, key: string, value: any) {
  //     var res = {};
  //     var textObject = JSON.stringify(object);
  //     if (textObject === '{}') {
  //         res = JSON.parse('{"' + key + '":' + value + '}');
  //     } else {
  //         res = JSON.parse('{' + textObject.substring(1, textObject.length - 1) + ',"' + key + '":' + value + '}');
  //     }
  //     return res;
  // }



  // async addToObject (ElementList: any, element: any) {
  //   let newList = Object.assign(ElementList, element)

  //   console.log('añadido', element);
  //   console.log('objeto', ElementList);

  //   return newList
  // }





  async diacriticSensitiveRegex(string = '') {
    return string.replace(/a/g, '[a,á,à,ä]')
      .replace(/e/g, '[e,é,ë]')
      .replace(/i/g, '[i,í,ï]')
      .replace(/o/g, '[o,ó,ö,ò]')
      .replace(/u/g, '[u,ü,ú,ù]');
  }


}
