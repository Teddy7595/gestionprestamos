
import {WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import {Socket} from 'socket.io';
import {DateProcessService} from 'src/Classes/classes.index';
import {VisitUser} from '../classes/userVisit';
import {i_Visit} from '../interfaces/i_visit';

import {VisitListService} from '../services/services.index';


@WebSocketGateway()
export class VisitGateway implements OnGatewayConnection, OnGatewayDisconnect {


  @WebSocketServer() server;
  users: number=0;

  constructor(
    private _visitListService: VisitListService,
    private _dateProcessService: DateProcessService
  ) {




  }

  async handleConnection(cliente: Socket) {
    // console.log('conectado un usuario', cliente.id);

    // const usuario = new VisitUser(cliente.id);
    // this._visitListService.agregar(usuario);

    // console.log('que es handshake', cliente.handshake)

    // console.log('clientes conectados', this._visitListService.lista);


    // console.log('server', this.server);
    // console.log('cliente', cliente);

    // console.log('cliente preba', cliente);

  }

  async handleDisconnect(cliente: Socket) {

    // console.log('desconectado un usuario', cliente.id);
    this.desconect(cliente);

  }

  async desconect(cliente: Socket){



      this._visitListService.borrarVisitUser(cliente.id);


    // this.server.emit('usuarios-activos', this._visitListService.getLista());

  }

  @SubscribeMessage('begin-visit')
  async beginVisit(cliente: any, payload: any) {

    let l: i_Visit = {

      rol: payload.rol,
      idUser: payload.idUser

   }

    this._visitListService.adminVisit(cliente.id, l);


  }


  // @SubscribeMessage('anunciar-Login')
  anunciarLogin(usuario: any) {

    let x: any = usuario;

    let l:any = {
      message: `Un ${x.rol} ha iniciado sesión`,
      detail: `${x.name} ${x.last_name}`
    }

    console.log('emitido', l);
    this.server.emit('ADM-anuncio-login', l);
    this.server.emit('ADM-onlineList', this._visitListService.adminLista);


  }

  @SubscribeMessage('logout-user')
  logoutUser(client: any, payload: any) {

    console.log('payload', payload);
    this._visitListService.userLogout(payload.idUser);



  }


  @SubscribeMessage('prueba')
  handleMessage(client: any, payload: any) {

    console.log('pruba client', client);
    console.log('prueba payload', payload);



  }


}
