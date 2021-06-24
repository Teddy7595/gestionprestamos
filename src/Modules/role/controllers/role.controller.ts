import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  Response,
  Request, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';


import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { Model } from 'mongoose';
import { responseInterface } from 'src/Response/interfaces/interfaces.index';
import { RolesDecorator } from '../decorators/roleDecorator.index';
import { RoleGuard } from '../guards/roleGuard.index';
import { RolesDto } from '../models/dto/dto.index';
import { Roles } from '../models/schemas/roleSchema';
import { RoleService } from '../services/role.service';


@Controller('roles')
export class RoleController {

  _Response: responseInterface;

  constructor(
    @InjectModel(Roles.name) private RolesModel: Model<Roles>,
    private readonly _roleService: RoleService,

    ) {}

  //@RolesDecorator('ADMIN_ROLE')
  //@UseGuards(AuthGuard('jwt'), RoleGuard)
  @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get(':id')
  async getRole(@Param('id') id: string, @Response() res: any): Promise<responseInterface> {

    console.log('id', id);
    this._Response = await this._roleService.get(id);

    return res.status(this._Response.status).json(this._Response);
  }

  //@RolesDecorator('ADMIN_ROLE')
  //@UseGuards(AuthGuard('jwt'), RoleGuard)
  @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get()
  async getRoles(@Response() res: any): Promise<responseInterface> {

    this._Response = await this._roleService.getAll();

    return res.status(this._Response.status).json(this._Response);
  }

  //@RolesDecorator('ADMIN_ROLE')
  //@UseGuards(AuthGuard('jwt'), RoleGuard)
  @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post()
  async createRole(@Body() body: Roles ,@Response() res: any): Promise<responseInterface> {

    this._Response = await this._roleService.create(body);

    return res.status(this._Response.status).json(this._Response);
  }

  //@RolesDecorator('ADMIN_ROLE')
  //@UseGuards(AuthGuard('jwt'), RoleGuard)
  //@UsePipes(ValidationPipe)
  @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @UsePipes(ValidationPipe)
  @Put(':id')
  async updateRole(@Param('id') id: string, @Body() body: RolesDto, @Response() res: any) {

    this._Response = await this._roleService.update(id, body);

    return res.status(this._Response.status).json(this._Response);
  }

  //@RolesDecorator('ADMIN_ROLE')
  //@UseGuards(AuthGuard('jwt'), RoleGuard)
  //@UsePipes(ValidationPipe)
  @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @UsePipes(ValidationPipe)
  @Delete(':id')
  async deleteRole(@Param('id') id: string, @Response() res: any) {

    this._Response = await this._roleService.delete(id);

    return res.status(this._Response.status).json(this._Response);
  }
}
