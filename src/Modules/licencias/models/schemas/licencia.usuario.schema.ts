import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


import * as Mongoose from "mongoose"
import * as uniqueValidator from "mongoose-unique-validator";
import * as castAggregation  from "mongoose-cast-aggregation";
import * as mongoosePaginate from "mongoose-paginate-v2";
import * as aggregatePaginate from "mongoose-aggregate-paginate-v2";
import * as mongoose_delete from "mongoose-delete";

import { DateProcessService } from "src/Classes/classes.index";
import { STATUS } from "../enums/licencia.status.enum";

const _dateService = new DateProcessService();

const status = Object.values(STATUS);
const enumStatus = {
    values: status,
    message: 'Estatus no permitido ${VALUE}'
};

@Schema()
export class LicenciaUsuario extends Document
{


    @Prop({
        type: String,
        required: true,
        default: STATUS.VIGENTE,
        enum: enumStatus
    })
    status: string

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        required: [true, 'Debe indicar el codigo dde la licencia'],
        default: null,
        ref: "Licencia"
    })
    licencia: string

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        required: [true, 'Debe indicar el codigo del usuario'],
        default: null,
        ref: "Users"
    })
    usuario: string

    @Prop({
        type: Number,
        required: true,
        default: 0,
    })
    dias: number

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

export const LicenciaUsuarioSchema = SchemaFactory.createForClass(LicenciaUsuario)
.plugin(uniqueValidator, {message: "Acción de ${PATH} inválida, ${VALUE}"})
.plugin(mongoosePaginate)
.plugin(aggregatePaginate)
.plugin(castAggregation)
.plugin(mongoose_delete, {overrideMethods: 'all'});