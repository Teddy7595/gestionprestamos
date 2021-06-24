import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PermisosGuard implements CanActivate 
{
	private return_var:boolean = false;
  	canActivate(
  	  context: ExecutionContext,
  	): boolean  
  	{

  		const request = context.switchToHttp().getRequest();
    	const { user } = request;

    	if (user.rol === 'ADMIN_ROLE' || user.rol === 'ENRUTATOR_ROLE')
    	{ 
    		this.return_var = true; console.log(user.permisos);
    	}
    	else 
    	{
    		(user.permisos.obtener.cliente === true)? this.return_var = true : this.return_var = false;
    	}

    	return this.return_var;
  	}
}

/*export class GetClientGuard implements CanActivate 
{
	private return_var:boolean = false;
  	canActivate(
  	  context: ExecutionContext,
  	): boolean  
  	{

  		const request = context.switchToHttp().getRequest();
    	const { user } = request;

    	if (user.rol === 'ADMIN_ROLE' || user.rol === 'ENRUTATOR_ROLE')
    	{ 
    		this.return_var = true;
    	}
    	else 
    	{
    		(user.permisos.obtener.cliente === true)? this.return_var = true : this.return_var = false;
    	}

    	return this.return_var;
  	}
}*/
