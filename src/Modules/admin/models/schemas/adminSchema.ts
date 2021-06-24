import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Mongoose } from "mongoose";



import * as uniqueValidator from "mongoose-unique-validator";
import * as castAggregation  from "mongoose-cast-aggregation";
import * as mongoosePaginate from "mongoose-paginate-v2";
import * as aggregatePaginate from "mongoose-aggregate-paginate-v2";
import * as mongoose_delete from "mongoose-delete";

import { DateProcessService } from "src/Classes/classes.index";
import { ActionAdmin } from "../actionTypes.enum";

const actionEnum = Object.values(ActionAdmin);
const action =
{
    values  : actionEnum,
    message : 'Esta acción no esta permitida'
};
const _dateService = new DateProcessService();

@Schema()
export class Admin extends Document
{

}

export const AdminSchema = SchemaFactory.createForClass(Admin)
.plugin(uniqueValidator, {message: "Acción inválida"})
.plugin(mongoosePaginate)
.plugin(aggregatePaginate)
.plugin(castAggregation)
.plugin(mongoose_delete, {overrideMethods: 'all'});