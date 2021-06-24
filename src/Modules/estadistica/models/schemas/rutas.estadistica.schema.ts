import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


import * as Mongoose from "mongoose"
import * as uniqueValidator from "mongoose-unique-validator"
import * as castAggregation  from "mongoose-cast-aggregation"
import * as mongoosePaginate from "mongoose-paginate-v2"
import * as aggregatePaginate from "mongoose-aggregate-paginate-v2"
import * as mongoose_delete from "mongoose-delete"

import { DateProcessService } from "src/Classes/classes.index"

const _dateService = new DateProcessService()

@Schema()//schema que almacenará en base la cantidad de rutas por dia y a que enrutador le pertenece
export class TrazaRutaSystema extends Document
{

  @Prop({
    type: Number,
    required: true
  })
  n_routes:number//numero de rutas que maneja un enrutador hasta el día de generar traza

  @Prop({
    type: Number,
    required: true
  })
  nb_route_low:number//numero de negocios en la ruta con menos prestamos (negocios)

  @Prop({
    type: Number,
    required: true
  })
  nb_route_high:number//numero de negocios en la ruta con mas prestamos (negocios)

  @Prop({
    type: String,
    required: true
  })
  enrutador_id:string//id del enrutador ncargado

  @Prop({
    type: String,
    required: true
  })
  route_id_bc_low :string//id de la ruta con menos prestamos (negocios)

  @Prop({
    type: String,
    required: true
  })
  route_id_bc_high:string//id de la ruta con mas prestamos (negocios)

  @Prop({
    type: Array,
    default: _dateService.setDate()
  })
  createdAt: string[]
}

export const TrazaRutaSystemaSchema = SchemaFactory.createForClass(TrazaRutaSystema)
.plugin(uniqueValidator, {message: "Acción de ${PATH} inválida, ${VALUE}"})
.plugin(mongoosePaginate)
.plugin(aggregatePaginate)
.plugin(castAggregation)
.plugin(mongoose_delete, {overrideMethods: 'all'});