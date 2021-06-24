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


export class concurrencia extends Document
{

    @Prop({
        type: String,
        required: [true]
    })
    tipo: string;

    @Prop({
        type: Number,
        required: [true, 'Debe instanciar el nro de pagos del cliente']
    })
    concurrencia: number;

}


@Schema()
export class Cliente extends Document
{
    @Prop({
        type: String,
        required: [true, 'Debe instanciar la identificación del cliente']
    })
    card_id: string;

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        refer: "Users",
        required: [false, "Debe pertenecer a un socio"]
    })
    enrutador_id:string;

    @Prop({
        type: String,
        required: [true, 'Debe instanciar el nombre del cliente']
    })
    name: string;

    @Prop({
        type: String,
        required: [true, 'Debe instanciar el apellido del cliente']
    })
    last_name: string;

    /* @Prop({
        type: String,
        required: [true, 'Debe instanciar la dirección del cliente']
    })
    dir_domicilio: string; */

    @Prop({
        type: Number,
        required: [true, 'Debe instanciar la edad del cliente']
    })
    edad: number;

    @Prop({
        type: Array,
        required: [true, "Debe incluir al menos un numero telefónico"]
    })
    phone:string;

    @Prop({
        type: String,
        required: [false]
    })
    photo:string;

    @Prop({
        type: String,
        required: [true, "Debe indicar el email del cliente"]
    })
    mail:string;

    @Prop({
        type: Array,
        required: [false, "Debe indicar el nivel de cliente"]
    })
    semáforo:string;

    @Prop({
        type: Array,
        required: false
    })
    geo:string;

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


    @Prop({
        type: String,
        required: [true, "Falta establecer la ciudad"],
        default: null
    })
    city:string;

    @Prop({
        type: String,
        required: [true, "Falta establecer el departamento"],
        default: null
    })
    department:string;

    @Prop({
      required: true,
      default: null,
    })
    pais: string;



}

export const ClienteSchema = SchemaFactory.createForClass(Cliente)
.plugin(uniqueValidator, {
  message: "El {PATH} {VALUE} ya está registrado en sistema",
})
.plugin(mongoosePaginate)
.plugin(aggregatePaginate)
.plugin(castAggregation)
.plugin(mongoose_delete, { overrideMethods: 'all' });