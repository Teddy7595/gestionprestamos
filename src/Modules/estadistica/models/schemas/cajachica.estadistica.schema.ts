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
export class TrazaCajaCHSystema extends Document
{
  @Prop({
    type: String,
    required: true
  })//enrutador que asignó la caja chica
  enrutador_id: string

  @Prop({
    type: String,
    required: true
  })//id de la caja chica con menos monto asignado
  cajaCH_low_id: string

  @Prop({
    type: String,
    required: true
  })//id de la caja chica con mas monto asignado
  cajaCH_high_id: string

  @Prop({
    type: Array,
    required: true
  })//historial de los gastos de operaciones del dia
  gastosOp: Array<object>

  @Prop({
    type: Number,
    required: true
  })//menor monto asignado
  cajaCH_low: number

  @Prop({
    type: Number,
    required: true
  })//mayor monto asignado
  cajaCH_high: number

  @Prop({
    type: Number,
    required: true
  })//nro de cajas manejadas por el enrutador hasta el dia
  nro_cajaCH: number

  @Prop({
    type: Array,
    default: _dateService.setDate()
  })
  createdAt: string[]
}

export const TrazaCajaCHSystemaSchema = SchemaFactory.createForClass(TrazaCajaCHSystema)
.plugin(uniqueValidator, {message: "Acción de ${PATH} inválida, ${VALUE}"})
.plugin(mongoosePaginate)
.plugin(aggregatePaginate)
.plugin(castAggregation)
.plugin(mongoose_delete, {overrideMethods: 'all'});