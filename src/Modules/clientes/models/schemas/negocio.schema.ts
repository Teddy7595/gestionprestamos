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
        required: [true, 'Debe instanciar la concurrencia de cobro']
    })
    concurrencia: number;

}




@Schema()
export class Cuota extends Document
{
    //monto obtenido del cobro
    @Prop({
        type: Number,
        required: [true, 'Debe proporcionar el monto pagado']
    })
    pagado:number;

    //variable del monto restante por pagar
    @Prop({
        type: Number,
        required: true
    })
    restante:number;

    //monto de abono o debe por cuota + cuota anterior
    @Prop({
        type: Number,
        default: 0
    })
    penalizacion:number;

    //la cantidad de cuotas pagadas
    @Prop({
        type: Number,
        required: true
    })
    cuotas_pagas:number;

    //resumen de la actividad por cuota
    @Prop({
        type: String,
        required: false,
        default: null
    })
    resumen:string;
}
export const CuotaSchema = SchemaFactory.createForClass(Cuota);

@Schema()
export class Negocio extends Document
{
    @Prop({
        type: Number,
        default: 0,
    })
    concurrencia: number;

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        refer: "Cliente",
        required: [true, "Debe incluir el cliente"]
    })
    cliente_id:string;

    @Prop({
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Debe incluir el cobrador encargado']
    })
    cobrador_id:string;

    @Prop({
        type: Number,
        required: [true, "Requiere el monto de crédito"]
    })
    venta:number;

    @Prop({
        type: Number,
        required: [true, "Debe establecer la tasa de interés"]
    })
    interes:number;

    @Prop({
        type: Number,
        required: [true, "Debe establecer el número de cuotas"]
    })
    ncuotas:number;

    @Prop({
        type: Number,
        default: 0
    })
    vcuotas:number;

    @Prop({
        type: Number,
        default: 0
    })
    total:number;

    @Prop({
        type: Boolean,
        default: true
    })
    pendiente:boolean;

    @Prop({
        type: Array,
        default: null
    })
    cuotas:Array<Cuota>;

    @Prop({
        type: Array,
        default: _dateService.setDate()
    })
    createdAt: string[];

    @Prop({
        type: Array,
        default: null
    })
    updatedAt: string[];

    @Prop({
        required: true,
        default: null,
      })
      domicilio: string;


}
export const NegocioSchema = SchemaFactory.createForClass(Negocio)
.plugin(uniqueValidator, {
  message: "El {PATH} {VALUE} ya está registrado en sistema",
})
.plugin(mongoosePaginate)
.plugin(aggregatePaginate)
.plugin(castAggregation)
.plugin(mongoose_delete, { overrideMethods: 'all' });