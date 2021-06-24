import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


import * as Mongoose from "mongoose"
import * as uniqueValidator from "mongoose-unique-validator";
import * as castAggregation  from "mongoose-cast-aggregation";
import * as mongoosePaginate from "mongoose-paginate-v2";
import * as aggregatePaginate from "mongoose-aggregate-paginate-v2";
import * as mongoose_delete from "mongoose-delete";

import { DateProcessService } from "src/Classes/classes.index";

const _dateService = new DateProcessService();

@Schema()
export class Licencia extends Document
{
  @Prop({
    type: String,
    required: [true, 'Debe indidcar un Alias al plan'],
    unique: true
  })
  alias: string

  @Prop({
    type: Mongoose.Schema.Types.ObjectId,
    required: [true, 'Debe indicar el codigo del administrdor'],
    default: null,
    ref: "Users"
  })
  admin: string

  @Prop({
    type: Number,
    required: [true, 'Debe establecer la cantidad de dias de duración'],
  })
  dias: number;

  @Prop({
    type: Number,
    required: [true, "Debe establecer el precio de la licencia"]
  })
  precio: number

  @Prop({
    type: String,
    required: false,
    default: "No tiene"
  })
  observación: string

  @Prop({
    // required: true,
    type: Array,
    default: _dateService.setDate()
  })
  createdAt: string;

  @Prop({
    // required: true,
    type: Array,
    default: null
  })
  updatedAt: string;

}

export const LicenciaSchema = SchemaFactory.createForClass(Licencia)
.plugin(uniqueValidator, {message: "Acción de ${PATH} inválida, ${VALUE}"})
.plugin(mongoosePaginate)
.plugin(aggregatePaginate)
.plugin(castAggregation)
.plugin(mongoose_delete, {overrideMethods: 'all'});