import {
  Controller,
  Post,
  Body,
  UsePipes,
  Response,
  ValidationPipe,
  UseGuards,
  Param,
} from '@nestjs/common';
import { SignupDto, SigninDto } from '../dto';
import { throws } from 'assert';
import { AuthService } from '../services/auth.service';

import { responseInterface } from 'src/Response/interfaces/interfaces.index';
import { ReferenceGuard } from '../guards/reference.guard';

@Controller('auth')
export class AuthController {

  _Response: responseInterface;


  constructor(private readonly _authService: AuthService) {}


  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() body: SignupDto, @Response() res: any): Promise<responseInterface> {

    this._Response = await this._authService.signup(body);

    return res.status(this._Response.status).json(this._Response);

  }

  @Post('signup/reference/:ref')
  @UseGuards(ReferenceGuard)
  // @UsePipes(ValidationPipe)
  async signupReference(@Param() param:string[], @Body() body: SignupDto, @Response() res: any): Promise<responseInterface> {


    // console.log('parametros', param);

    // return res.end();

    this._Response = await this._authService.signup2(body, param);

    return res.status(this._Response.status).json(this._Response);

  }


  @Post('signin')
  @UsePipes(ValidationPipe)
  async signin(@Body() body: SigninDto, @Response() res: any): Promise<responseInterface> {

    this._Response = await this._authService.signin(body);

    return res.status(this._Response.status).json(this._Response);

  }
}
