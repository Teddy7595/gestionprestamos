import { IsNotEmpty, IsString } from "class-validator";

export class GenerarReferidoDto 
{

    @IsNotEmpty({message: "no debe dejar este elemento vacio, direccion"})
    @IsString()
    url: string;
  
    @IsNotEmpty({message: "no debe dejar este elemento vacio, id de enrutador"})
    @IsString()
    enrutador: string;
  
    @IsNotEmpty({message: "no debe dejar este elemento vacio, rol"})
    @IsString()
    rol: string;
  
  }