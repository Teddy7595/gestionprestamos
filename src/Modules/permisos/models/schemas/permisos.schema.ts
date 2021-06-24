import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


import * as Mongoose from "mongoose"
import * as uniqueValidator from "mongoose-unique-validator";
import * as mongoosePaginate from "mongoose-paginate-v2";
import * as mongoose_delete from "mongoose-delete";

import { DateProcessService } from "src/Classes/classes.index";

const _dateService = new DateProcessService();

export class ObtenerModel
{
  @Prop({
    type: Boolean,
    required: false,
    default: true
  })
  cobro: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: true
  })
  cliente: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: true
  })
  negocio: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: true
  })
  rutas: boolean;
}

export class CrearModel
{
  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  cobro: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  cliente: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  negocio: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  rutas: boolean;
}

export class ModificarModel
{
  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  cobro: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  cliente: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  negocio: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  rutas: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  cobrador_rutas: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  cobrador_cliente: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  cliente_rutas: boolean;
}

export class EliminarModel
{
  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  cobro: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  cliente: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  negocio: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false
  })
  rutas: boolean;
}

@Schema()
export class Permiso extends Document
{
  @Prop({
    type: Mongoose.Schema.Types.ObjectId,
    required: [true, 'Debe indicar el codigo del usuario'],
    ref: "Users"
  })
  enrutador_id: string;

  @Prop({
    type: Mongoose.Schema.Types.ObjectId,
    required: [true, 'Debe indicar el codigo del usuario'],
    ref: "Users",
    unique: true
  })
  usuario: string;

  @Prop({
    type: ObtenerModel,
    required: [true, 'Debe establecer los permisos para ver datos'],
  })
  obtener: ObtenerModel;

  @Prop({
    type: CrearModel,
    required: [true, 'Debe establecer los permisos de creación'],
  })
  crear: CrearModel;

  @Prop({
    type: ModificarModel,
    required: [true, 'Debe establecer los permisos de modificación'],
  })
  modificar: ModificarModel;

  @Prop({
    type: EliminarModel,
    required: [true, 'Debe establecer los permisos de eliminación'],
  })
  eliminar: EliminarModel;

  @Prop({
    // required: true,
    type: Array,
    default: _dateService.setDate()
  })
  createdAt:string;

  @Prop({
    // required: true,
    type: Array,
    default: null
  })
  updatedAt:string[];

}

export const PermisoSchema = SchemaFactory.createForClass(Permiso)
.plugin(uniqueValidator, {message: "Acción de ${PATH} inválida, ${VALUE}"})
.plugin(mongoosePaginate)
.plugin(mongoose_delete, {overrideMethods: 'all'});