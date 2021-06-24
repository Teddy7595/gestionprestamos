import { MongooseModule } from "@nestjs/mongoose"; 
import { TrazaEstadisticaSystema, TrazaEstadisticaSystemaSchema } from './traza.estadistica.schema'
import { TrazaNegocioSystema, TrazaNegocioSystemaSchema } from './negocio.estadistica.schema'
import { TrazaPagoSystema, TrazaPagoSystemaSchema } from './pagos.estadisticas.schema'
import { TrazaRutaSystema, TrazaRutaSystemaSchema } from './rutas.estadistica.schema'
import { TrazaCajaCHSystema, TrazaCajaCHSystemaSchema } from './cajachica.estadistica.schema'

export const _TRAZAESTADISTICASYSTEMACHEMA = MongooseModule.forFeature([
  { 
    name: TrazaEstadisticaSystema.name,  
    schema: TrazaEstadisticaSystemaSchema,
  },
]);

export const _TRAZANEGOCIOSYSTEMACHEMA = MongooseModule.forFeature([
  { 
    name: TrazaNegocioSystema.name,  
    schema: TrazaNegocioSystemaSchema,
  },
]);

export const _TRAZAPAGOSYSTEMACHEMA = MongooseModule.forFeature([
  { 
    name: TrazaPagoSystema.name,  
    schema: TrazaPagoSystemaSchema,
  },
]);

export const _TRAZARUTASYSTEMACHEMA = MongooseModule.forFeature([
  { 
    name: TrazaRutaSystema.name,  
    schema: TrazaRutaSystemaSchema,
  },
]);

export const _TRAZACAJACHSYSTEMACHEMA = MongooseModule.forFeature([
  { 
    name: TrazaCajaCHSystema.name,  
    schema: TrazaCajaCHSystemaSchema,
  },
]);