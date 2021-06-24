import { MongooseModule } from "@nestjs/mongoose";
import { Ruta, RutaSchema } from "./ruta.schema";
import { TablaDiaria, TablaDiariaSchema } from "./tablaDiaria.schema"



export const _RUTASCHEMA = MongooseModule.forFeature([
  {
    name: Ruta.name,
    schema: RutaSchema,
  },
]);

export const _TABLASCHEMA = MongooseModule.forFeature([
  {
    name: TablaDiaria.name,
    schema: TablaDiariaSchema,
  },
]);