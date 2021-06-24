export interface BussinesTrace
{
    enrutador_id	    ?:string //enrutador al que pertenece el negocio
    cobrador_id_low     ?:string //cobrador al que le pertenece el negocio mas bajo
    cobrador_id_high    ?:string //cobrador al que le pertenece el negocio mas alto
    pclient_low		    ?:string //_id del cliente con el prestamo mas bajo
    pclient_high	    ?:string //_id del cliente con el prestamo mas alto
    prestamo_low	    ?:number //prestamo mas bajo de todos los negocios
    prestamo_high	    ?:number //prestamo mas alto d todos los neogiocios
    prestamo_count	    ?:number //cantidad de prestamos que tiene el enrutador
}