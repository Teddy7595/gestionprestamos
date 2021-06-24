import { Module } from '@nestjs/common';
import
{
    BitacoraMainController
}from "./controllers/index.controller";
import 
{
    ModelsModule
} from './models/models.module';
import 
{
    BitacoraService
} 
from './services/index.service';

import { AuthModule } from '../auth/auth.module';

@Module({
    controllers:[
        BitacoraMainController
    ],
    providers:[
        BitacoraService,
        ModelsModule,    
        BitacoraService
    ],
    imports:[
        ModelsModule,
        AuthModule
    ],
    exports:[
        BitacoraService,
        ModelsModule    
    ]
})
export class BitacoraModule {}
