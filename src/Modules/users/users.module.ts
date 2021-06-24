import { Module } from "@nestjs/common";

// controladores
import { UsersController } from "./controllers/controllers.index";
 
// servicios
import { UsersService } from "./services/services.index";

// esquemas
import {  UsersModelsModule } from "./models/usersModels.module";
import { AuthModule } from "../auth/auth.module";

// modulo de  proceso de datos

@Module({
  imports: [
    UsersModelsModule,
    AuthModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
