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
export class TrazaPagoSystema extends Document
{
  @Prop({
    type: String,
    required: true
  })//enrutador que maneja el prestamo
  enrutador_id: string
  
  @Prop({
    type: String,
    required: true
  })//cobrdor manejando el menor prestamo
  cobrador_id_low: string

  @Prop({
    type: String,
    required: true
  })//cobrdor manejando el mayor prestamo
  cobrador_id_high: string
  
  @Prop({
    type: String,
    required: true
  })//negocio con el menor pago
  pbussines_id_low: string

  @Prop({
    type: String,
    required: true
  })//negocio con el mayor pago
  pbussines_id_high: string

  @Prop({
    type: Number,
    required: true
  })//menor pago
  payment_low: number

  @Prop({
    type: Number,
    required: true
  })//myor pago
  payment_high: number

  @Prop({
    type: Number,
    required: true
  })//cantidad pagos hechos ese dia
  payment_count: number

  @Prop({
    type: Array,
    default: _dateService.setDate()
  })
  createdAt: string[]
}

export const TrazaPagoSystemaSchema = SchemaFactory.createForClass(TrazaPagoSystema)
.plugin(uniqueValidator, {message: "Acción de ${PATH} inválida, ${VALUE}"})
.plugin(mongoosePaginate)
.plugin(aggregatePaginate)
.plugin(castAggregation)
.plugin(mongoose_delete, {overrideMethods: 'all'});