import {IsString, IsNumber, IsNotEmpty, IsBoolean} from "class-validator"

export class UserPermisosDTO 
{
	@IsString()
	@IsNotEmpty()
	enrutador_id:string

	@IsString()
	@IsNotEmpty()
	usuario:string

	//permisos de lectura
	@IsBoolean()
	@IsNotEmpty()
	view_cobro:boolean;

	@IsBoolean()
	@IsNotEmpty()
	view_negocio:boolean;

	@IsBoolean()
	@IsNotEmpty()
	view_rutas:boolean;

	@IsBoolean()
	@IsNotEmpty()
	view_cliente:boolean;

	//permisos de escritura
	@IsBoolean()
	@IsNotEmpty()
	crear_cobro:boolean;

	@IsBoolean()
	@IsNotEmpty()
	crear_negocio:boolean;

	@IsBoolean()
	@IsNotEmpty()
	crear_rutas:boolean;

	@IsBoolean()
	@IsNotEmpty()
	crear_cliente:boolean;

	//permisos de modificacion
	@IsBoolean()
	@IsNotEmpty()
	modify_cliente:boolean;

	@IsBoolean()
	@IsNotEmpty()
	modify_cobro:boolean;

	@IsBoolean()
	@IsNotEmpty()
	modify_negocio:boolean;

	@IsBoolean()
	@IsNotEmpty()
	modify_rutas:boolean;

	@IsBoolean()
	@IsNotEmpty()
	modify_cliente_rutas:boolean;

	@IsBoolean()
	@IsNotEmpty()
	modify_cobrador_cliente:boolean;

	@IsBoolean()
	@IsNotEmpty()
	modify_cobrador_rutas:boolean;

	//permisos de borrado
	@IsBoolean()
	@IsNotEmpty()
	delete_cobro:boolean;

	@IsBoolean()
	@IsNotEmpty()
	delete_negocio:boolean;

	@IsBoolean()
	@IsNotEmpty()
	delete_rutas:boolean;

	@IsBoolean()
	@IsNotEmpty()
	delete_cliente:boolean;
}

export class ModifyPermisosDTO 
{
	@IsString()
	@IsNotEmpty()
	_id:string

	@IsBoolean()
	@IsNotEmpty()
	view_cobro:boolean;

	@IsBoolean()
	@IsNotEmpty()
	view_negocio:boolean;

	@IsBoolean()
	@IsNotEmpty()
	view_rutas:boolean;

	@IsBoolean()
	@IsNotEmpty()
	view_cliente:boolean;

	@IsBoolean()
	@IsNotEmpty()
	crear_cobro:boolean;

	@IsBoolean()
	@IsNotEmpty()
	crear_negocio:boolean;

	@IsBoolean()
	@IsNotEmpty()
	crear_rutas:boolean;

	@IsBoolean()
	@IsNotEmpty()
	crear_cliente:boolean;

	@IsBoolean()
	@IsNotEmpty()
	modify_cliente:boolean;

	@IsBoolean()
	@IsNotEmpty()
	modify_cobro:boolean;

	@IsBoolean()
	@IsNotEmpty()
	modify_negocio:boolean;

	@IsBoolean()
	@IsNotEmpty()
	modify_rutas:boolean;

	@IsBoolean()
	@IsNotEmpty()
	modify_cliente_rutas:boolean;

	@IsBoolean()
	@IsNotEmpty()
	modify_cobrador_cliente:boolean;

	@IsBoolean()
	@IsNotEmpty()
	modify_cobrador_rutas:boolean;

	@IsBoolean()
	@IsNotEmpty()
	delete_cobro:boolean;

	@IsBoolean()
	@IsNotEmpty()
	delete_negocio:boolean;

	@IsBoolean()
	@IsNotEmpty()
	delete_rutas:boolean;

	@IsBoolean()
	@IsNotEmpty()
	delete_cliente:boolean;
}

