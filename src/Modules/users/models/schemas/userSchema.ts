import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import * as Mongoose from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";
import * as castAggregation  from "mongoose-cast-aggregation";
import * as mongoosePaginate from "mongoose-paginate-v2";
import * as aggregatePaginate from "mongoose-aggregate-paginate-v2";
import * as mongoose_delete from "mongoose-delete";
import { DateProcessService } from "src/Classes/classes.index";

// SCHMA DE EJEMPLO


const _dateService = new DateProcessService();


// @Schema()
export class _files extends Document {

  @Prop({
    required: true,
    default: null,
  })
  type: string;
  @Prop({
    required: true,
    default: null,
  })
  file: string;
  @Prop({
    required: true,
    default: null,
  })
  format: string;
  @Prop({
    required: true,
    default: null,
  })
  folder: string;

}



@Schema()
export class Users extends Document {

  @Prop({
    type: _files,
    default: null,
  })
  photo: _files;

  @Prop({
    required: true,
    default: null,
  })
  name: string;

  @Prop({
    required: true,
    default: null,
  })
  last_name: string;

  @Prop({
    required: true,
    default: null,
  })
  id_card: string;

  @Prop({
    required: true,
    default: null,
  })
  pais: string;

  @Prop({
    required: true,
    default: null,
  })
  estado: string;

  @Prop({
    required: true,
    default: null,
  })
  ciudad: string;

  @Prop({
    required: true,
    default: null,
  })
  dir_domicilio: string;

  @Prop({
    required: true,
    default: null,
  })
  nro_movil: string;

  @Prop({
    required: true,
    default: null,
  })
  nro_fijo: string;

  @Prop({
    required: true,
    default: null,
  })
  edad: number;



  @Prop({
    default: 'ACTIVE',
  })
  status: string;

  @Prop({
    required: true,
    unique: true
  })
  email: string;

  @Prop({
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Roles",
    default: '5f8593fa2675cb18ec300162',
    required: [true, "Debe establecer un rol"],
  })
  rol: string;

  @Prop({required: true})
  pass: string;

  @Prop({
    type:   Array,
    required: true,
    default: _dateService.setDate(),
  })
  createdAt: string;

  @Prop({
    type: Array,
    default: null,
  })
  updatedAt: string;

  @Prop({
    type: Array,
    required: true,
    default: _dateService.setDate(),
  })
  last_session: string;

  @Prop({
    default: null,
  })
  enrutator_id: string;
/*
  @Prop({
    type: Boolean,
    default: true,
  })
  can_in: boolean;//valor de uso interno para licencias*/
}

export const UsersSchema = SchemaFactory.createForClass(Users)
  .plugin(uniqueValidator, {
    message: "El {PATH} {VALUE} ya está registrado en sistema",
  })
  .plugin(mongoosePaginate)
.plugin(aggregatePaginate)
.plugin(castAggregation)
  .plugin(mongoose_delete, { overrideMethods: 'all' });


