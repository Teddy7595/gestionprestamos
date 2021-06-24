import { Module } from '@nestjs/common';

import
{
	PermisoController
} from './controller/index.controller'

import
{
	PermisoSchemaModule
} from './models/schemas/permisos.module'

import
{
	ServicesModule
} from './services/services.module'

import { AuthModule } from '../auth/auth.module'

@Module({
	controllers:[PermisoController],
	imports:[PermisoSchemaModule, ServicesModule, AuthModule],
	providers:[ServicesModule],
	exports:[ServicesModule]
})
export class PermisosModule {}
