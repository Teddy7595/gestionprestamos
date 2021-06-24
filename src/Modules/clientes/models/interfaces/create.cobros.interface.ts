import {Model} from "mongoose";
import {Cobros} from "../schemas/cobros.schema";
import {Negocio} from "../schemas/negocio.schema";

export interface createCobroCliente
{
    cuota:Model<Negocio>
    cobro:Model<Cobros>
}

export interface createCuotaCliente
{
	pagado:number
	restante:number
	penalizacion:number
	cuotas_restante:number
}