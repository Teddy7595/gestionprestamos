import { Global, Module } from '@nestjs/common';

import 
{
	_PERMISOSCHEMA
} from './index.schema'

@Global()
@Module({
	imports:[_PERMISOSCHEMA],
	exports:[_PERMISOSCHEMA],
	providers:[]

})
export class PermisoSchemaModule {}
