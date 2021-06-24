import { Global, Module } from '@nestjs/common';
import { _USERSCHEMA } from './schemas.index';



@Global() 
@Module({
  imports: [_USERSCHEMA],
  controllers: [],
  providers: [],
  exports: [_USERSCHEMA],
})
export class UsersModelsModule {}
