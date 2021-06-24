import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { ConfigService } from "../../../Config";
import { Configuration } from "../../../Config/config.keys";

// import { InjectRepository } from '@nestjs/typeorm';
import { IJwtPayload } from '../jwt-payload.interface';
import {  Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from 'src/Modules/users/models/schemas/userSchema';
import { Model } from 'mongoose';
import { ProcessDataService } from 'src/Classes/classes.index';
import { responseInterface, _argsFind } from 'src/Response/interfaces/interfaces.index';

import * as express from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  _Response: responseInterface;
  // res = new Response();
  // response = new Response();
  response = express().response;


  constructor(
    @InjectModel(Users.name) private UsersModel: Model<Users>,
    private readonly _configService: ConfigService,
    private _processData: ProcessDataService,

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get(Configuration.JWT_SECRET),
    });

  }

  async validate(payload: IJwtPayload) {
    const { email } = payload;

    // console.log('validate');
    const args: _argsFind = {
      findObject: {
        email: email,
      },
      populate: {
        path: 'rol',
        select: 'rol'
      },
      // select: "rol"
    }

    await this._processData._findOneDB( this.UsersModel, args ).then(async (r: responseInterface) => {

      // console.log('la respuesta', r);

      payload.rol = r.data.rol.rol;
      // this._Response = r;

      // this._Response.data = payload;
//
      // console.log('response', this._Response);
//
      // return this.response.status(this._Response.status).json(this._Response);

    }, err => {
      // console.log('entra aca2');
      // this._Response = err;
      // // // this.express.response.status
      // return this.response.status(this._Response.status).json(this._Response);
      throw new UnauthorizedException();
    });


    // console.log('el pay', payload);

    return payload;
  }
}


