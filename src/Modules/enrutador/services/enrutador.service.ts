import {Injectable} from '@nestjs/common';
import {responseInterface} from 'src/Response/interfaces/interfaces.index';
import {GenerarReferidoDto} from '../models/dto/dto.index';

@Injectable()
export class EnrutadorService {
    private _Response: responseInterface;

    async generarReferido(body: GenerarReferidoDto): Promise<responseInterface> {
        if (!body.url||!body.enrutador||!body.url) {
            this._Response={status: 400, message: "Referencia inválida", ok: false}

        } else {
            let url: string=body.url+"/auth/register/"+body.enrutador+"/"+body.rol;
            this._Response={status: 200, data: url, ok: true, message: "Se ha generador el código de referido"};
        }

        return this._Response;
    }
}
