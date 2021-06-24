import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


import * as Mongoose from "mongoose"
import * as uniqueValidator from "mongoose-unique-validator";
import * as mongoosePaginate from "mongoose-paginate-v2";
import * as mongoose_delete from "mongoose-delete";

import { DateProcessService } from "src/Classes/classes.index";

const _dateService = new DateProcessService();

@Schema()
export class Banco 
{
  @Prop({ 
    type: String,
    required: [true, 'Debe establecer el nombre del banco'],
  })
  nombre:string;

  @Prop({ 
    type: String,
    required: [true, 'Debe establecer la cuenta de banco del empleado'],
  })
  cuenta:string;
}  

@Schema()
export class Salario extends Document
{
  @Prop({ //monto de salario siendo calculado con los gastos en la caja chica
    type:Number,
    required: [true, 'Debe establecer el monto'],
  })
  monto:number;

  @Prop({ //monto de los gastos en la caja chica
    type:Number,
    required: [true, 'Debe establecer el monto de gasto de operación'],
  })
  gasto:number;

  @Prop({
    // required: true,
    type: Array,
    default: _dateService.setDate()
  })
  createdAt:string;
}
export const SalarioSchema = SchemaFactory.createForClass(Salario)
 

@Schema()
export class Nomina extends Document
{
  @Prop({
    type: Mongoose.Schema.Types.ObjectId,
    required: [true, 'Debe indicar el codigo del usuario'],
    ref: "Users"
  })
  enrutador: string;  

  @Prop({
    type: Mongoose.Schema.Types.ObjectId,
    required: [true, 'Debe indicar el codigo del usuario'],
    ref: "Users",
    unique: true
  })
  cobrador:string;

  @Prop({ //cuenta bancaria al empleado
    type:Banco,
    required: [true, 'Debe indicar la cuenta del empleado']
  }) 
  banco:Banco;

  @Prop({ //salario base
    type:Number,
    required: [true, 'Debe establecer el monto'],
  })
  salario:number;
 
  @Prop({ //para generar alguna notacion con respecto al tipo de pago o algo en específico
    type: String,
    required: false,
    default: "No tiene"
  })
  observación:string; 

  @Prop({ //para determinar si esta o no activo el empleado
    type: Boolean,
    required: false,
    default: true
  })
  activo:boolean;

  @Prop({ //determina la el tiempo de pago
    type:Number,
    required: [true, 'Debe establecer el tiempo de pago de nómina en dias, este tiempo tambien determina el rango para calcular deducciones'],
    default: 15 //puede ser QUINCENAL tambien
  })
  concurrencia:number;

  @Prop({ //historial de pago
    type: Array,
    required: false,
    default: null
  })
  pago:Salario[];

  @Prop({ //guarda la ultima fecha donde se realizo el calculo de salario
    type: Array,
    default: null
  })
  last_pago:string[];

  @Prop({ //guarda la fecha donde se deberealizar el siguiente calculo de salario
    type: Array,
    default: null
  })
  next_pago:string[];

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

export const NominaSchema = SchemaFactory.createForClass(Nomina)
.plugin(uniqueValidator, {message:  'Ya existe este cobrador anexado en la nómina'})
.plugin(mongoosePaginate)
.plugin(mongoose_delete, {overrideMethods: 'all'});
