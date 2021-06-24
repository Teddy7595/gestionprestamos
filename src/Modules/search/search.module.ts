import { Module } from '@nestjs/common';

import { SearchController } from './controllers/controllers.index';
import { SearchService } from './services/services.index';

import { UsersModule } from '../Routes.module.index';


@Module({
  imports: [UsersModule],
  controllers: [SearchController],
  providers: [SearchService]

})
export class SearchModule {}
