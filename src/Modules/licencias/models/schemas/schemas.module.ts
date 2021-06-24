import { Global, Module } from '@nestjs/common';
import { _LICENCIASCHEMA, _LICENCIASOLICITUDSCHEMA, _LICENCIAUSUARIOSCHEMA } from './index.schema';

@Global()
@Module({
   imports:
   [
       _LICENCIASCHEMA,
       _LICENCIASOLICITUDSCHEMA,
       _LICENCIAUSUARIOSCHEMA
   ],
   providers:[],
   exports:
   [
       _LICENCIASCHEMA,
       _LICENCIASOLICITUDSCHEMA,
       _LICENCIAUSUARIOSCHEMA
   ]
})
export class LicenciaSchemaModule {}
