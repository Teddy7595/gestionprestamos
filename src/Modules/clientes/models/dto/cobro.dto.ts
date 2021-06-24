import { IsNotEmpty, IsString, IsNumber  } from "class-validator"

export class createCobroClienteDto
{
    @IsNotEmpty()
    @IsString()
    cobrador_id:string;
    
    @IsNotEmpty()
    @IsString()
    negocio_id:string;

    @IsString()
    cuota_nro:number;// -> variable para uso del sistema, exclusivamente

    @IsNotEmpty()
    @IsString()
    observacion:string;

    @IsNotEmpty()
    @IsString()
    monto:number;
}

export class modifyCobroClienteDto
{

    @IsString()
    cobrador_id:string;

    @IsString()
    cliente_id:string;

    @IsString()
    enrutador_id:string;

    @IsString()
    cobro_id:string;

    @IsString() 
    observacion:string;

    @IsNotEmpty()
    @IsString()
    monto:number;

    status:string;
}