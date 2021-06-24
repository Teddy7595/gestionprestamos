export interface pettycashTrace
{
	enrutador_id		?:string //id del enrutador
	gastosOp 			?:Array<object>//id de la caja chica con el gasto de operacion del dia
	cajaCH_low_id		?:string//id de la caja chica con menos monto asignado
	cajaCH_high_id		?:string//id de la caja chica con mas monto asignado
	nro_cajaCH			?:number//numero de cajas chicas totales que maneja el enrutador 
	cajaCH_high 		?:number//valor de la caja chica con mas monto asignado
	cajaCH_low 			?:number//valor de la caja chica con menos monto asignado
}