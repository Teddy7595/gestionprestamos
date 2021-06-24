import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class NegocioCreacionDto
{
    @IsString()
    @IsNotEmpty()
    cliente_id:string;
    
    @IsString()
    @IsNotEmpty()
    cobrador_id:string;
    
    @IsNumber()
    @IsNotEmpty()
    venta:number;

    @IsNumber()
    @IsNotEmpty()
    interes:number;

    @IsNumber()
    @IsNotEmpty()
    ncuotas:number;
    //habia olvidado añadir la concurrencia, los dias entre cobro y cobro
    @IsNumber()
    @IsNotEmpty()
    concurrencia:number;
}

export class NegocioUnicoPeticionDto
{
    
    @IsString()
    @IsNotEmpty()
    cliente_id:string;

    @IsString()
    @IsNotEmpty()
    _id:string;
}

export class NegocioPeticionDto
{
    
    @IsString()
    @IsNotEmpty()
    cliente_id:string;
}

export class NegocioModificacionDto
{
    @IsString()
    @IsNotEmpty()
    _id:string;
    
    @IsNumber()
    @IsNotEmpty()
    venta:number;

    @IsNumber()
    @IsNotEmpty()
    intereses:number;

    @IsNumber()
    @IsNotEmpty()
    ncuotas:number;

    @IsNumber()
    @IsNotEmpty()
    vcuotas:number;
    //habia olvidado añadir la concurrencia, los dias entre cobro y cobro
    @IsNumber()
    @IsNotEmpty()
    concurrencia:number;
}

export class NegocioEliminacionDto
{
    @IsString()
    @IsNotEmpty()
    _id:string;
}