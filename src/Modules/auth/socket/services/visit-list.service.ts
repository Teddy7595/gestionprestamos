import { Injectable } from '@nestjs/common';
import {VisitUser} from '../classes/userVisit';
import {i_Visit} from '../interfaces/i_visit';

@Injectable()
export class VisitListService {



    public adminLista: any = [];

    public enrutadorLista: any = [];


    constructor() { }

    // Agregar un VisitUser
    public agregar( VisitUser ) {

        this.adminLista.push( VisitUser );
        // console.log( this.adminLista );
        return VisitUser

    }

    public adminVisit( id: string, data: i_Visit  ) {

        console.log('la lista', this.adminLista);
        let c = this.adminLista.find( VisitUser => {

            console.log('la VisitUser', VisitUser.dataVisit.idUser);

            return VisitUser.dataVisit.idUser == data.idUser
        });



        if(c == null){

            // const usuario = new VisitUser(id);
            const usuario = {
                id: [id],
                dataVisit: null
            }
            this.adminLista.push(usuario);


        for( let VisitUser of this.adminLista ) {

            if ( VisitUser.id.includes(id) ) {
                VisitUser.dataVisit = data;
                break;
            }

        }


        console.log('añadido ===== Actualizando VisitUser ====');
        console.log( this.adminLista );


     }

     if(c != null){

        for( let VisitUser of this.adminLista ) {

            if ( !VisitUser.id.includes(id) ) {
                VisitUser.id.push(id); //<- si el usuario abre un nuevo cliente pero ya se encuentra logueado entonces le digo que añada el id de ese nuevo cliente
                // VisitUser.dataVisit = data;
                break;
            }

        }

        console.log('añadido ===== Actualizando VisitUser ====');
        console.log( this.adminLista );

     }

    }

    // Obtener lista de VisitUsers
    public getLista() {

        // console.log('el get lista', this.adminLista);
        return this.adminLista;
    }

    // Obtener un VisitUser
    public getVisitUser( id: string ) {

        return this.adminLista.find( VisitUser => {
            // VisitUser.id === id
            return VisitUser.id.includes(id)
        } );

    }

    public getExcludeVisitbyId( id: any ) {


        // return this.adminLista.filter( VisitUser => {

        //     VisitUser.sala === sala

        // } );


        // return this.adminLista.find( VisitUser => {
        //     // VisitUser.id === id
        //     return VisitUser.id.includes(id)
        // } );

    }

    // Obtener VisitUser en una sala en particular
    public getVisitUsersEnSala( sala: string ) {

        // return this.adminLista.filter( VisitUser =>VisitUser.sala === sala );
        return;
    }

    // Borrar VisitUser
    public async borrarVisitUser( id: string ) {


        await this.adminLista.forEach((element, idx) => {

            if(element.id.includes(id)){

                if(element.id.length > 0){

                    let ides = element.id.filter( r => {
                        return r !== id
                    } );
                    this.adminLista[idx].id = ides;
                }

                if(element.id.length == 0){

                    this.adminLista.splice( idx, 1);

                }

            }



        });

        // this.adminLista = this.adminLista.filter( VisitUser => VisitUser.id !== id );

        console.log('borrar===== Actualizando VisitUser ====');
        console.log( this.adminLista );

        // return tempVisitUser;

    }


    async userLogout(id: string){


        let l = this.adminLista.filter( VisitUser => {

            return VisitUser.dataVisit.idUser !== id

        });

        this.adminLista = l;


        console.log('logout===== Actualizando VisitUser ====');
        console.log( l );

    }


}
