import { MongooseModule } from "@nestjs/mongoose";
import 
{
	Permiso,
	PermisoSchema,
	CrearModel,
	ModificarModel,
	EliminarModel
} from './permisos.schema'

export 
{
	CrearModel,
	ModificarModel,
	EliminarModel
} from './permisos.schema'

export const _PERMISOSCHEMA = MongooseModule.forFeature([
	{
		name: Permiso.name,
		schema: PermisoSchema
	}
]);