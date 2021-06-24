import { Module } from '@nestjs/common';
import {EstadisticasController} from './controllers/estadisticas.controller';
import 
{
    EstadisticaService,
    Negocio_EstadisticaService,
    Pagos_EstadisticaService,
    HandlerStatService,
    Rutas_EstadisticaService,
    Cajachica_EstadisticaService
} from './services/index.services';
import { AuthModule } from '../auth/auth.module';
import { _CLIENTESCHEMA, _NEGOCIOSCHEMA, _COBROSCHEMA } from '../clientes/models/schemas/schemas.index';
import { _USERSCHEMA } from '../users/models/schemas.index';
import { RutaModule } from '../enrutador/models/rutaModels.module';
import { SchemasModule } from '../nomina/models/schemas/schemas.module'
import { ClientesModule } from '../clientes/clientes.module';
import { Estadisticas_ModelsModule } from './models/estadisticas.models.module';

@Module({
    controllers:
    [
        EstadisticasController,
    ],
    providers:
    [
        ClientesModule,
    	EstadisticaService,
        Negocio_EstadisticaService,
        Pagos_EstadisticaService,
        Rutas_EstadisticaService,
        Cajachica_EstadisticaService,
        HandlerStatService
    ],
    imports:
    [
    	AuthModule, 
    	_NEGOCIOSCHEMA, 
    	_USERSCHEMA, 
    	_CLIENTESCHEMA,
        _COBROSCHEMA, 
        RutaModule,
        SchemasModule,
        ClientesModule,
        Estadisticas_ModelsModule
    ]
})
export class EstadisticaModule {}
