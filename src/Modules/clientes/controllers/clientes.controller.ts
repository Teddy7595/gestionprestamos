import { Controller, Response, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {SameUserAuthGuard} from 'src/Modules/auth/guards/same-user-auth.guard';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";
import { responseInterface } from 'src/Response/interfaces/interfaces.index';
import { ClienteDto } from '../models/dto/index.dto';
import { ClienteService, RutaClienteService } from '../services/services.index';


@Controller('clientes') 
export class ClientesController
{
    private _Response:responseInterface;

    constructor
    (
        private _clienteService:ClienteService,
        private _rutaClienteService:RutaClienteService
    ){}

    @Get('hello')
    async sayHello(@Response() res:any):Promise<responseInterface>
    {
        return res.status(200).json("Ruta de manejo de clientes activa");
    }

    // @RolesDecorator('ENRUTATOR_ROLE')
    // @UseGuards(AuthGuard('jwt'), RoleGuard, SameUserAuthGuard)
    @Post('crearSingle/:id')//tomo formulario y creo un cliente
    async createClientSingle( @Param('id') id:string , @Body() body: any, @Response() res:any):Promise<responseInterface>
    {

        this._Response = await this._clienteService.createClientSingle(body, id);
        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE','ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Put('modificar/:id/:idCliente')//tomo formulario y creo un cliente
    async updateOneCliente(@Param('idCliente') idCliente:string, @Param('id') id:string , @Body() body:any, @Response() res:any):Promise<responseInterface>
    {

        this._Response = await this._clienteService.updateOneCliente(body, idCliente);
        return res.status(this._Response.status).json(this._Response);
    }


    @Get('allClients')//obtengo el cliente perteneciente al cobrador
    async getAllClientsAdmin( @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._clienteService.getAllClientsAdmin(  );
        return res.status(this._Response.status).json(this._Response);
    }


    @Get('allByEnrouter/:id')//obtengo el cliente perteneciente al cobrador
    async getClientsByEnrouter(@Param() params:string[], @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._clienteService.getClientsByEnrouter( params['id'] );
        return res.status(this._Response.status).json(this._Response);
    }

    @Get('getCliente/:id')//obtengo el cliente perteneciente al cobrador
    async getOneClienteById(@Param() params:string[], @Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._clienteService.getOneClienteById( params['id'] );
        return res.status(this._Response.status).json(this._Response);
    }

    // @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    // @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Delete('borrar/:cliente')//tomo el id del cliente y lo borro, pero bajo confirmacion del admin
    async delOneCliente(@Param('cliente') cliente:string, @Response() res:any):Promise<responseInterface>
    {

        this._Response = await this._clienteService.delOneCliente(cliente);
        return res.status(this._Response.status).json(this._Response);

    }


    // @RolesDecorator('ADMIN_ROLE','ENRUTATOR_ROLE')
    // @UseGuards(AuthGuard('jwt'), RoleGuard, SameUserAuthGuard)
    // @Post('crear/:id/:idRuta')//tomo formulario y creo un cliente
    // async createNewCliente(@Param('idRuta') idRuta:string, @Param('id') id:string , @Body() body:ClienteDto, @Response() res:any):Promise<responseInterface>
    // {
    //     // console.log('la puta madre');
    //     // return res.status(200).json("aaaaa");
    //     this._Response = await this._clienteService.createNewCliente(body, idRuta);
    //     return res.status(this._Response.status).json(this._Response);
    // }


    // @RolesDecorator('ADMIN_ROLE','ENRUTATOR_ROLE')
    // @UseGuards(AuthGuard('jwt'), RoleGuard, SameUserAuthGuard)
    // @Delete('borrar/:id/:cliente')//tomo el id del cliente y lo borro, pero bajo confirmacion del admin
    // async delOneCliente(@Param('cliente') cliente:string, @Response() res:any):Promise<responseInterface>
    // {
    //     this._Response = await this._clienteService.delOneCliente(cliente);
    //     return res.status(this._Response.status).json(this._Response);
    // }


    // @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    // @UseGuards(AuthGuard('jwt'), RoleGuard)
    // @Get('all/:cobrador')//obtengo los cliente pertenecientes al cobrdor
    // async getAllClientes(@Param('cobrador') cobrador:string, @Response() res:any):Promise<responseInterface>
    // {
    //     this._Response = await this._clienteService.getAllClientes(cobrador);
    //     return res.status(this._Response.status).json(this._Response);
    // }


    // @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'COLLECTOR_ROLE')
    // @UseGuards(AuthGuard('jwt'), RoleGuard)
    // @Get(':cliente/:cobrador')//obtengo el cliente perteneciente al cobrador
    // async getOneCliente(@Param() params:string[], @Response() res:any):Promise<responseInterface>
    // {
    //     this._Response = await this._clienteService.getOneCliente(params['cliente'], params['cobrador']);
    //     return res.status(this._Response.status).json(this._Response);
    // }

    // @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'ENRUTATOR_ROLE')
    // @UseGuards(AuthGuard('jwt'), RoleGuard)
    // @Post('crear/:cobrador')//tomo formulario y creo un cliente
    // async createNewCliente(@Param('cobrador') cobrador:string, @Body() body:ClienteDto, @Response() res:any):Promise<responseInterface>
    // {
    //     this._Response = await this._clienteService.createNewCliente(body, cobrador);
    //     return res.status(this._Response.status).json(this._Response);
    // }



    // @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    // @UseGuards(AuthGuard('jwt'), RoleGuard)
    // @Post('enlazar/:cliente/:ruta')//tomo el id del cliente y el id de la ruta y lo enlazo
    // async linkToRouteOneCliente(@Param() params:string[], @Body() enlace:any, @Response() res:any):Promise<responseInterface>
    // {
    //     this._Response = await this._rutaClienteService.linkToRouteOneCliente(params['ruta'], params['cliente']);
    //     return res.status(this._Response.status).json(this._Response);
    // }

}


/*
endpoints cliente

Post -> /crearSingle/:id <- el id del enrutador o socio - Crea un nuevo cliente asignado a un socio
Recibe un body conformado por
{
    name:
    last_name:
    edad:
    card_id:
    phone:
    mail:
    enrutador_id:
    pais:
    department:
    city:
}

Get -> /allClients  - Retorna todos los clientes de la plataforma, sin importar sus socios

Get /allByEnrouter/:id <- id del enrutador o socio - Retorna todos los clientes pertenecientes a un enrutador
Get /getCliente/:id <- id del cliente en especifico - Retorna la información de un cliente en especifico

Delete / borrar/:cliente <- id del cliente en especifico  - Elimina un cliente

*/




// import { Controller, Response, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
// import { responseInterface } from 'src/Response/interfaces/interfaces.index';
// import { ClienteDto } from '../models/dto/index.dto';
// import { ClienteService, RutaClienteService } from '../services/services.index';

// import { AuthGuard, PassportModule } from '@nestjs/passport';
// import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
// import {RoleGuard} from "src/Modules/role/guards/roleGuard.index";

// @Controller('clientes')
// export class ClientesController
// {
//     private _Response:responseInterface;

//     constructor
//     (
//         private _clienteService:ClienteService,
//         private _rutaClienteService:RutaClienteService
//     ){}

//     @Get('hello')
//     async sayHello(@Response() res:any):Promise<responseInterface>
//     {
//         return res.status(200).json("Ruta de manejo de clientes activa");
//     }

//     @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
//     @UseGuards(AuthGuard('jwt'), RoleGuard)
//     @Get('all/:cobrador')//obtengo los cliente pertenecientes al cobrdor
//     async getAllClientes(@Param('cobrador') cobrador:string, @Response() res:any):Promise<responseInterface>
//     {
//         this._Response = await this._clienteService.getAllClientes(cobrador);
//         return res.status(this._Response.status).json(this._Response);
//     }


//     @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'COLLECTOR_ROLE')
//     @UseGuards(AuthGuard('jwt'), RoleGuard)
//     @Get(':cliente/:cobrador')//obtengo el cliente perteneciente al cobrador
//     async getOneCliente(@Param() params:string[], @Response() res:any):Promise<responseInterface>
//     {
//         this._Response = await this._clienteService.getOneCliente(params['cliente'], params['cobrador']);
//         return res.status(this._Response.status).json(this._Response);
//     }

//     @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE', 'ENRUTATOR_ROLE')
//     @UseGuards(AuthGuard('jwt'), RoleGuard)
//     @Post('crear/:cobrador')//tomo formulario y creo un cliente
//     async createNewCliente(@Param('cobrador') cobrador:string, @Body() body:ClienteDto, @Response() res:any):Promise<responseInterface>
//     {
//         this._Response = await this._clienteService.createNewCliente(body, cobrador);
//         return res.status(this._Response.status).json(this._Response);
//     }

//     @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
//     @UseGuards(AuthGuard('jwt'), RoleGuard)
//     @Delete('borrar/:cliente')//tomo el id del cliente y lo borro, pero bajo confirmacion del admin
//     async delOneCliente(@Param('cliente') cliente:string, @Response() res:any):Promise<responseInterface>
//     {
//         this._Response = await this._clienteService.delOneCliente(cliente);
//         return res.status(this._Response.status).json(this._Response);
//     }

//     @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
//     @UseGuards(AuthGuard('jwt'), RoleGuard)
//     @Post('enlazar/:cliente/:ruta')//tomo el id del cliente y el id de la ruta y lo enlazo
//     async linkToRouteOneCliente(@Param() params:string[], @Body() enlace:any, @Response() res:any):Promise<responseInterface>
//     {
//         this._Response = await this._rutaClienteService.linkToRouteOneCliente(params['ruta'], params['cliente']);
//         return res.status(this._Response.status).json(this._Response);
//     }

// }
