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
const status = Object.values(statusCobro)
const statusC ={
    values: status,
    message: "El status {VALUE} no esta permitido"
};

@Schema()
export class CambioCobro extends Document
{
    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Debe instanciar el cobrador encargado']
    })
    cobrador_id: string;

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Debe instanciar el enrutador encargado']
    })
    enrutador_id: string;

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: [true, 'Debe instanciar el cliente del cobro a cambiar']
    })
    cliente_id: string;

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Cobros',
        required: [true, 'Debe instanciar el codigo del cobro']
    })
    cobro_id: string;

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
        default: statusCobro.PENDIENTE,
        enum: statusC
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
export const CambioCobroSchema = SchemaFactory.createForClass(CambioCobro)
.plugin(uniqueValidator, {
  message: "El {PATH} {VALUE} ya está registrado en sistema",
})
.plugin(mongoosePaginate)
.plugin(aggregatePaginate)
.plugin(castAggregation)
.plugin(mongoose_delete, { overrideMethods: 'all' });