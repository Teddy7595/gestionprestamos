import { Global, Module } from '@nestjs/common';
import { _ROLESSCHEMA } from './schemas.index';


@Global()
@Module({
    imports: [_ROLESSCHEMA],
    exports: [_ROLESSCHEMA],
    controllers: [],
    providers: [],
})
export class RoleModelsModule {}
