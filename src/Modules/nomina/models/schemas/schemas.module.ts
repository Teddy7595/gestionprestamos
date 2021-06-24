import { Global, Module } from '@nestjs/common';
import
{
	_NOMINASCHEMA, 
	_CAJACHICASCHEMA,
	_GASTOSOPSCHEMA,
	_SALARIOSCHEMA
} from './index.schema'; 

@Global()
@Module({
	imports: [_NOMINASCHEMA, _CAJACHICASCHEMA, _GASTOSOPSCHEMA, _SALARIOSCHEMA],
	exports: [_NOMINASCHEMA, _CAJACHICASCHEMA, _GASTOSOPSCHEMA, _SALARIOSCHEMA]
})
export class SchemasModule{}
