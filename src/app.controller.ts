import { Controller, Get, UseGuards } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import { AppService } from './app.service';
import {RolesDecorator} from './Modules/role/decorators/role.decorator';
import {RoleGuard} from './Modules/role/guards/role.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @RolesDecorator('ADMIN_ROLE', 'ENRUTATOR_ROLE')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
