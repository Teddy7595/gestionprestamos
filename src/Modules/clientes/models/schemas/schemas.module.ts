import { Global, Module } from '@nestjs/common';
import {_CAMBIOCOBROSCHEMA, _CLIENTESCHEMA, _NEGOCIOSCHEMA, _CUOTASCHEMA} from './schemas.index';

@Global()
@Module({
    imports:[_CAMBIOCOBROSCHEMA, _CLIENTESCHEMA, _CLIENTESCHEMA, _NEGOCIOSCHEMA, _CUOTASCHEMA],
    providers:[],
    exports:[_CAMBIOCOBROSCHEMA, _CLIENTESCHEMA, _CLIENTESCHEMA, _NEGOCIOSCHEMA, _CUOTASCHEMA]
})
export class ClienteModelsModule {}
