import { Module } from '@nestjs/common';
import 
{ 
    ControlLicenciasController, 
    SolicitudLicenciaController,
    LicenciasController,
    LicenciaUsuarioController
    
} from './controllers/controllers.index';
import 
{ 
    _LICENCIASCHEMA, 
    _LICENCIASOLICITUDSCHEMA, 
    _LICENCIAUSUARIOSCHEMA
} 
from './models/schemas/index.schema';
import 
{ 
    ControlLicenciaService, 
    LicecniaUsuarioService, 
    LicenciasService, 
    SolicitudLicenciaService
} 
from './services/services.index';

import {UsersService} from '../users/services/services.index';

import { AuthModule } from '../auth/auth.module';

@Module({
    imports:
    [
        _LICENCIASCHEMA,
       _LICENCIASOLICITUDSCHEMA,
       _LICENCIAUSUARIOSCHEMA,
       AuthModule
    ],
    controllers:
    [ 
        LicenciasController,
        SolicitudLicenciaController,
        ControlLicenciasController,
        LicenciaUsuarioController
    ],
    providers:
    [
        LicenciasService,
        ControlLicenciaService,
        SolicitudLicenciaService,
        LicecniaUsuarioService,
        UsersService
    ]
})
export class LicenciasModule {}
