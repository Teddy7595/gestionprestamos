/*import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import * as Mongoose from "mongoose"; 
import * as uniqueValidator from "mongoose-unique-validator";
import * as mongoosePaginate from "mongoose-paginate-v2";
import * as mongoose_delete from "mongoose-delete";

import { DateProcessService } from "src/Classes/classes.index";


const _dateService = new DateProcessService();

@Schema()
export class GastosOperacion extends Document 
{

    @Prop({//quien asigna la caja
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Debe instanciar al enrutador quien asignó la caja chica']
    })
    enrutador: string;

    @Prop({//dueño de la caja y solo debe existir un solo cobrador con una sola caja
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Debe instanciar al dueño de la caja chica'],
    })
    cobrador: string;

    @Prop({//dueño de la caja y solo debe existir un solo cobrador con una sola caja
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'CajaChica',
        required: [true, 'Debe instanciar la caja chica'],
    })
    cajachica: string;

    @Prop({//asigno el monto del gasto
        type: Number,
        required: [true, 'Debe instanciar el monto del gasto realizado'],
        default: 0.00
    })
    monto: number;

    @Prop({//asigno el monto anterior de la caja
        type: Number,
        required: false,
        default: 0.00
    })
    monto_caja: number;

    @Prop({//descripcion del gasto
        type: String,
        required: [true, 'Debe especificar en que se dio el gasto']
    })
    desc: string;

    @Prop({
        type: Array,
        default: _dateService.setDate()
    })
    createdAt: string;

    @Prop({
        type: Array,
        default: null
    })
    updatedAt: string[];

}

export const GastosOperacionSchema = SchemaFactory.createForClass(GastosOperacion)
.plugin(uniqueValidator, {
  message: "El {PATH} {VALUE} ya está registrado en sistema",
})
.plugin(mongoosePaginate)
.plugin(mongoose_delete, { overrideMethods: 'all' });*/