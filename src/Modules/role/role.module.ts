import { Module } from '@nestjs/common';

import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';
import { RoleModelsModule } from './models/roleModels.module';
// import { AuthModule } from '../Routes.module.index';
import { AuthModule } from '../auth/auth.module';



@Module({
  imports: [RoleModelsModule, AuthModule],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService]
})
export class RoleModule {}
