import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import * as Mongoose from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";
import * as castAggregation  from "mongoose-cast-aggregation";
import * as mongoosePaginate from "mongoose-paginate-v2";
import * as aggregatePaginate from "mongoose-aggregate-paginate-v2";
import * as mongoose_delete from "mongoose-delete";

import { DateProcessService } from "src/Classes/classes.index";


const _dateService = new DateProcessService();

@Schema()
export class TablaDiaria extends Document
{

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    })
    enrutador_id: string 

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    })
    cobrador_id: string 

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        refer: "Cliente",
        required: true
    })
    cliente_id:string;

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Negocio',
        required: true,
        unique: [true, 'Ya existe un negocio registrado con este codigo']
    })
    negocio_id: string

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Ruta',
        required: true
    })
    ruta_id: string

    @Prop({
        type: Boolean,
        required: true,
        default: true
    })
    pendiente: boolean

    @Prop({
        type: Array,
        required: false,
        default: null
    })
    prev_pago: Array<string>

    @Prop({
        type: Array,
        required: true,
        default: null
    })
    next_pago: Array<string>

    @Prop({
        type: Number,
        required: true,
        default: 0
    })
    concurrencia: number

    @Prop({
        type: Array,
        required: false,
        default: _dateService.setDate()
    })
    createdAt: string
}

export const TablaDiariaSchema = SchemaFactory.createForClass(TablaDiaria)
.plugin(uniqueValidator, 
{
  message: "El {PATH} {VALUE} ya está registrado en sistema",
})
.plugin(mongoosePaginate)
.plugin(aggregatePaginate)
.plugin(castAggregation)
.plugin(mongoose_delete, { overrideMethods: 'all' })