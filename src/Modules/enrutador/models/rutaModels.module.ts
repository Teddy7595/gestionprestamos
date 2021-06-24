import { Global, Module } from '@nestjs/common';
import { _RUTASCHEMA, _TABLASCHEMA } from './schemas/schemas.index';

@Global()
@Module({
    imports:[_RUTASCHEMA, _TABLASCHEMA],
    exports:[_RUTASCHEMA, _TABLASCHEMA]
})
export class RutaModule {}
