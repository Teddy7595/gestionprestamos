import { Module } from '@nestjs/common';
import {VisitGateway} from './gateways/gateways.index';
import { VisitListService } from './services/visit-list.service';




@Module({
  providers: [ VisitGateway, VisitListService],
  exports: [ VisitListService, VisitGateway ]
})
export class AuthsocketModule {}
