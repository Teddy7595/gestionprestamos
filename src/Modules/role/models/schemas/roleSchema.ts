import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Mongoose } from "mongoose";



import * as uniqueValidator from "mongoose-unique-validator";
import * as castAggregation  from "mongoose-cast-aggregation";
import * as mongoosePaginate from "mongoose-paginate-v2";
import * as aggregatePaginate from "mongoose-aggregate-paginate-v2";
import * as mongoose_delete from "mongoose-delete";

import { DateProcessService } from "src/Classes/classes.index";
import { RoleType } from "../roletype.enum";



const rolesEnum = Object.values(RoleType);

const roles = {
    values: rolesEnum,
    message: 'El rol {VALUE} no esta permitido'
}; //array de rolesEnum

const _dateService = new DateProcessService();

@Schema()
export class Roles extends Document {


  @Prop({
    type: String,
    required: true,
    default: 'DEFAULT_ROLE',
    enum: roles,
    unique: true,

  })
  rol: string;

  @Prop({
    type: String,
    required: false,
    default: '',
  })
  description: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    default: '',
  })
  alias: string;

  @Prop({
    type: String,
    required: false,
    default: 'ACTIVE',
  })
  status: string;

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

export const RolesSchema = SchemaFactory.createForClass(Roles)
.plugin(uniqueValidator, {
  message: "El {PATH} {VALUE} ya está registrado en sistema",
})
.plugin(mongoosePaginate)
.plugin(aggregatePaginate)
.plugin(castAggregation)
.plugin(mongoose_delete, { overrideMethods: 'all' });



