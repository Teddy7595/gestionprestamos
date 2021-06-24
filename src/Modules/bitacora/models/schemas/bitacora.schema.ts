import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import * as Mongoose from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";
import * as castAggregation  from "mongoose-cast-aggregation";
import * as mongoosePaginate from "mongoose-paginate-v2";
import * as aggregatePaginate from "mongoose-aggregate-paginate-v2";
import * as mongoose_delete from "mongoose-delete";

import { DateProcessService } from "src/Classes/classes.index";
import {Action} from "../enum/index.enum";


const _dateService = new DateProcessService();

const action = {
    values: Object.values(Action),
    message: "La acción {VALUE} no esta permitida"
}

@Schema()
export class Bitacora extends Document
{
    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        required: [true, "Falta quien hizo la acción"],
        ref: 'Users'
    })
    actor:string;

    @Prop({
        type: String,
        required: [true, "Falta acciòn del evento"],
        enum: action
    })
    action:string;

    @Prop({
        type: String,
        required: [true, "Falta evento"],
        default: "Falta descripción de la acción!!"
    })
    event:string;

    @Prop({
        type: String,
        required: [true, "Falta area donde se originó el reporte"],
        default: "Falta área donde se originó el reporte!!"
    })
    type:string;


    @Prop({
        type: Array,
        default: _dateService.setDate()
    })
    createdAt: string;

}
export const BitacoraSchema = SchemaFactory.createForClass(Bitacora)
.plugin(uniqueValidator, {
  message: "El {PATH} {VALUE} ya está registrado en sistema",
})
.plugin(mongoosePaginate)
.plugin(aggregatePaginate)
.plugin(castAggregation)
.plugin(mongoose_delete, { overrideMethods: 'all' });
