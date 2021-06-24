import { Global, Module } from '@nestjs/common';
import { _LICENSESCHEMA, _ADMINSCHEMA, _HISTSCHEMA } from './schemas.index';



@Global()
@Module({
  imports: [_LICENSESCHEMA, _ADMINSCHEMA, _HISTSCHEMA],
  controllers: [],
  providers: [],
  exports: [_LICENSESCHEMA, _ADMINSCHEMA, _HISTSCHEMA],
})
export class AdminModelModule {}
