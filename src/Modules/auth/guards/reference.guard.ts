import { CanActivate, ExecutionContext, Injectable, Param } from '@nestjs/common';
import { RoleService } from 'src/Modules/role/services/role.service';
import { UsersService } from 'src/Modules/users/services/users.service';
import { responseInterface } from 'src/Response/interfaces/interfaces.index';

@Injectable()
export class ReferenceGuard implements CanActivate
{

  private _ResponseRol:responseInterface;
  private _ResponseUsr:responseInterface;
  private _Result:boolean;

  constructor
  (
    private readonly _userService:UsersService,
    private readonly _rolService:RoleService

  ){ this._Result = false; }

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean>
  {
    let reference: any = context.switchToHttp().getRequest();


    // console.log('entra acá esto', reference);

    // this._ResponseRol = await this._rolService.get(reference['params'].rol);
    this._ResponseUsr = await this._userService.getOne(reference.params.ref);



    if(reference.params)
    {

      if(!this._ResponseUsr.ok)
      {

        this._Result = false;

      }else if(this._ResponseUsr.data.rol.rol === 'ENRUTATOR_ROLE'){

        console.log('aprobado');
        this._Result = true;

      }

      return this._Result;
    }
  }
}
