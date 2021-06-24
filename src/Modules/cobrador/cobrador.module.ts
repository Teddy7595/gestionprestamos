import { Module } from '@nestjs/common';
import {ClientesModule} from '../clientes/clientes.module';
import {CobradorController} from './controllers/cobrador.controller';
import {CobradorService} from './services/cobrador.service';


@Module({
//   imports:[RutaModule],
  controllers: [CobradorController],
  providers: [ CobradorService ],
  imports: [
    ClientesModule
  ]
})
export class CobradorModule {}
