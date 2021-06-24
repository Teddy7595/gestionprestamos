import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SameUserAuthGuard implements CanActivate {


  canActivate(
    context: ExecutionContext,
  ): boolean  {
    const request = context.switchToHttp().getRequest();
    const { user } = request; //<- se obtiene el deshasheo del token
    const tokenID = user._id;
    const id = request.params.id;

    // se compara si el id del dueño del token es el mismo del id pasado por params
    // console.log('los reqs', request.params.id);


    if( ( ( tokenID ) && ( id )) && ( tokenID === id)  ){
      return true;
    }else{
      return false;
    }


  }
}
