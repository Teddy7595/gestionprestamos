import { Injectable } from '@nestjs/common';

@Injectable()
export class SetStatusMessageService {




    setMessage(message: string, status){


        switch (status) {
            case 200:
                return `${message} exitosamente`
                break;
            case 201:
                return `${message} creado exitosamente`
                break;
            case 400:
                return `${message} no procesado`
                break;
            case 404:
                return `${message} inexistente`
                break;

            default:
                break;
        }

    }

}
