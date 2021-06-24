import {MongooseModule} from "@nestjs/mongoose";
import {Bitacora, BitacoraSchema} from "./bitacora.schema";


export const _BITACORASCHEMA = MongooseModule.forFeature([
    {
        name: Bitacora.name,
        schema: BitacoraSchema
    }
]);