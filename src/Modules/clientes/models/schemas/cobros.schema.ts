import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import * as Mongoose from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";
import * as castAggregation  from "mongoose-cast-aggregation";
import * as mongoosePaginate from "mongoose-paginate-v2";
import * as aggregatePaginate from "mongoose-aggregate-paginate-v2";
import * as mongoose_delete from "mongoose-delete";

import { DateProcessService } from "src/Classes/classes.index";
import {statusCobro} from "../enum/status.cobro.enum";

const _dateService = new DateProcessService();
const status = Object.values(statusCobro);
const st =
{ 
    values: status,
    message: "El estatus {VALUE} no esta permitido"
};

@Schema()
export class Cobros extends Document
{

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Debe instanciar el cobrador encargado']
    })
    cobrador_id: string;

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Negocio',
        required: [true, 'Debe instanciar el negocio con el cliente para el cobro']
    })
    negocio_id: string;

    @Prop({
        type: Number,
        default: null
    })
    cuota_nro: number;

    @Prop({
        type: String,
        default: "Sin Observaciones"
    })
    observacion: string;

    @Prop({
        type: Number,
        required: [true, 'Debe indicar el monto del pago']
    })
    monto: number;

    @Prop({
        type: String,
        required: [true, 'Debe establecer un estatus del cobro'],
        default: statusCobro.CREADO,
        enum: st
    })
    status: string;

    @Prop({
        type: Array,
        default: _dateService.setDate()
    })
    createdAt: string;

    @Prop({
        type: Array,
        default: null
    })
    updatedAt: string;
}
export const CobrosSchema = SchemaFactory.createForClass(Cobros)
.plugin(uniqueValidator, {
  message: "El {PATH} {VALUE} ya está registrado en sistema",
})
.plugin(mongoosePaginate)
.plugin(aggregatePaginate)
.plugin(castAggregation)
.plugin(mongoose_delete, { overrideMethods: 'all' });