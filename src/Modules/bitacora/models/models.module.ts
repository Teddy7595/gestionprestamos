import { Module } from '@nestjs/common';
import 
{
    _BITACORASCHEMA, 
} 
from './schemas/index.schema';

@Module({
    imports:[
        _BITACORASCHEMA
    ],
    exports:[
        _BITACORASCHEMA
    ]
})
export class ModelsModule {}
