import { Module, Global } from '@nestjs/common';

import
{
	PermisoService

} from './index.service';

@Global()
@Module({
	imports:[],
	exports:[PermisoService],
	providers:[PermisoService]
})
export class ServicesModule {}
