
import {
  Controller,
  Get,
  Body,
  Post,
  Request,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Response,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {SameUserAuthGuard} from "src/Modules/auth/guards/same-user-auth.guard";
import {RolesDecorator} from "src/Modules/role/decorators/role.decorator";
import {RoleGuard} from "src/Modules/role/guards/role.guard";
import { UsersService } from "src/Modules/users/services/users.service";


import {responseInterface} from "src/Response/interfaces/interfaces.index";
import {SearchService} from "../services/search.service";

@Controller("search")
export class SearchController {

  _Response: responseInterface;

  constructor(
    private _searchService: SearchService,
    private _userService: UsersService
    ) { }




  // @RolesDecorator('ADMIN_ROLE')
  // @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get("users/:arg")
  async searchGetUser(
    @Param("arg") arg: string,
    @Response() res: any
  ): Promise<responseInterface> {

    this._Response=await this._searchService.searchGetUser(arg);

    return res.status(this._Response.status).json(this._Response);
  }


  // @RolesDecorator('ADMIN_ROLE')
  // @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get("usersEnrouters/:arg")
  async searchGetUserEnrrouter(
    @Param("arg") arg: string,
    @Response() res: any
  ): Promise<responseInterface> {

    this._Response=await this._searchService.searchGetUserEnrrouter(arg);

    return res.status(this._Response.status).json(this._Response);
  }

  // @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  // @UseGuards(AuthGuard('jwt'), RoleGuard, SameUserAuthGuard)
  @Get("getCollectorsByEnrouter/:id/:arg")
  async getCollectorsByEnrouter(
    @Param("arg") arg: string,
    @Param("id") id: string,
    @Response() res: any
  ): Promise<responseInterface> {

    this._Response=await this._searchService.getCollectorsByEnrouter(arg, id);

    return res.status(this._Response.status).json(this._Response);
  }

  // @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  // @UseGuards(AuthGuard('jwt'), RoleGuard, SameUserAuthGuard)
  @Get("getMyRoutes/:id/:arg")
  async searchMyRoutesEnrouter(
    @Param("arg") arg: string,
    @Param("id") id: string,
    @Response() res: any
  ): Promise<responseInterface> {

    this._Response=await this._searchService.searchMyRoutesEnrouter(arg, id);

    return res.status(this._Response.status).json(this._Response);
  }


  // constructor(private _userService: UsersService) {}
  @Get()
  getHello(): string {
    return "Ruta para el sistema de busqueda";
  }

}
