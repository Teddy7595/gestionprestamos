import { Global, Module } from '@nestjs/common';
import {_CLIENTESCHEMA} from './schemas/schemas.index';

@Global()
@Module({
    imports:[_CLIENTESCHEMA],
    providers:[],
    exports:[_CLIENTESCHEMA]
})
export class ClienteModelsModule {}
