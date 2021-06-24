import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import 
{ 
    DateProcessService, 
    ProcessDataService 
} 
from 'src/Classes/classes.index';
import { responseInterface } from 'src/Response/interfaces/interfaces.index';
import { solicitudLicenciaDto } from '../models/dto/solictud.dto';
import 
{ 
    LicenciaSolicitud 
} 
from '../models/schemas/index.schema';

import {Cron, CronExpression} from '@nestjs/schedule'

@Injectable()
export class ControlLicenciaService 
{
    private _Response:responseInterface;

    constructor
    (
        private _processData:ProcessDataService,
        private _dateService: DateProcessService,
    )
    {

    }

    private relooControl()
    {

    }

}
