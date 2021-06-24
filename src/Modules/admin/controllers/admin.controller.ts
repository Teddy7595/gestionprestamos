import { Controller, Get, Post, Body, Response, Param, Put, Delete, UseGuards } from "@nestjs/common";
import { responseInterface } from "src/Response/interfaces/interfaces.index";
import { AdminService,AdminLicService, AdminHistService } from "../services/services.index";
import { RoleUserDto } from "../models/dto/admin.dto";
import { LicenseDto, LicenseChangeStatusDto, BitacoraDto} from "../models/dto/dto.index";
import { BitacoraInterface } from "../models/interfaces/bitacora.interface";
import { ActionAdmin, ActionDescp } from "../models/actionTypes.enum";


import { AuthGuard, PassportModule } from '@nestjs/passport';
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/role.guard";

@Controller("admin")
export class AdminController
{
    private _Response:responseInterface;

    constructor
    (
        private _admin:AdminService,
        private _licAdmin:AdminLicService,
        private _histAdmin:AdminHistService
    ){}



    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get("users")
    async getUser(@Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._admin.getUsers();

        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get("users/roles")
    async getRoles(@Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._admin.getRoles();

        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post("users/roles/:id")
    async setRoleUser(@Body() body: any, @Response() res:any, @Param('id') id:string):Promise<responseInterface>
    {
        this._Response = await this._admin.setRoleUser(body,id);

        return res.status(this._Response.status).json(this._Response);
    }



    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get("users/licencias")
    async getSavedLicenses(@Response() res:any):Promise<responseInterface>
    {
        this._Response = await this._licAdmin.getLicense();

        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post("users/licencias")
    async setUsers(@Body() body: LicenseDto, @Response() res: any): Promise<responseInterface>
    {
        this._Response = await this._licAdmin.setUserLicense(body);

        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Delete("users/licencias/:id") //borrar la licencia de un usuario
    async deleteUserLicense(@Response() res:any, @Param('id') id:string):Promise<responseInterface>
    {
        this._Response = await this._licAdmin.deleteUserLicense(id);

        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Get("users/licencias/:id") //ver la licencia de un usuario en particular
    async getUserLicense(@Response() res:any, @Param('id') id:string):Promise<responseInterface>
    {
        this._Response = await this._licAdmin.getUserLicense(id);

        return res.status(this._Response.status).json(this._Response);
    }

    @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Put("users/licencias/:id") //modificar licencia a un usuario
    async changeStatusLic(@Body() body: LicenseChangeStatusDto, @Response() res: any, @Param('id') id:string): Promise<responseInterface>
    {
        this._Response = await this._licAdmin.changeUserLicense(body, id);

        return res.status(this._Response.status).json(this._Response);
    }

    /*
    @Get("bitacora")//obtiene todos los registro de bitacora
    async getBitacoraAdmin(@Response() res: any): Promise<responseInterface>
    {
        this._Response = await this._histAdmin.getBitacora();

        return res.status(this._Response.status).json(this._Response);
    }
    */

    //to DO -> la siguiente ruta es de prueba de bitacora, tratar de implementar cuanto antes
//     private body:BitacoraInterface;
//     @Post("bitacora")
//     async setBitacora( @Response() res: any)
//     {
//         this.body = new BitacoraDto;
//         this.body.status = ActionAdmin.LICENSE;
//         this.body.admin = "5f74f168e6e4cd1f64bf0b93";
//         this.body.usuario = "5f74f168e6e4cd1f64bf0b93";
//         this.body.descripcion = ActionDescp.SET_LICENSE;

//         console.log("ActionAdmin", this.body, " ", this._histAdmin.setBitacora(this.body));

//         return res.status(200).json(this.body);
//     }


// }

}
