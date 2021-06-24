export interface modifyCobrosCliente
{
    _id?:string;

    cobrador_id?:string;

    cliente_id?:string;

    enrutador_id?:string;

    cobro_id?:string;
    
    observacion?:string;
    
    status?:string;
    
    updatedAt?:string[];
    
    monto:number;
}