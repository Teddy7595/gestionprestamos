import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule } from '../../config/config.module';

// import { Configuration } from '../../Config/config.keys';
// import { ConfigService } from '../../Config';

import { AuthService,SetUserMenuService } from './services/authServices.index';

import { RoleService } from '../role/services/role.service';
import { UsersService } from '../users/services/users.service';
import {ConfigModule} from 'src/Config/config.module';
import {ConfigService} from 'src/Config';
import {Configuration} from 'src/Config/config.keys';

// import { ModelsModule } from '../users/models/models.module';
import { AuthsocketModule } from './socket/authsocket.module';
import {ServicesModule} from '../permisos/services/services.module';


@Module({
  imports: [
    ConfigModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    // ModelsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          secret: config.get(Configuration.JWT_SECRET),
          signOptions: {
            expiresIn: '48h',
          },
        };
      },
    }),

    AuthsocketModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, SetUserMenuService, RoleService, UsersService, ServicesModule],
  exports: [JwtStrategy, PassportModule, SetUserMenuService, AuthsocketModule],

  // providers: [AuthService, JwtStrategy, SetUserMenuService, RoleService, UsersService, ServicesModule],
  // exports: [JwtStrategy, PassportModule, SetUserMenuService],
})

export class AuthModule {}



