import { MongooseModule } from "@nestjs/mongoose";
import 
{
	Banco,
	Nomina, 
	NominaSchema,
	Salario,
	SalarioSchema
} from './nomina.schema'

import 
{
	CajaChica,
	CajaChicaSchema,
	GastosOperacion,
	GastosOperacionSchema
} from './cajachica.schema'

export 
{
	CajaChica,
	CajaChicaSchema,
	GastosOperacion
} from './cajachica.schema'

export 
{
	Banco,
	Nomina, 
	NominaSchema,
	Salario,
	SalarioSchema
} from './nomina.schema'


export const _NOMINASCHEMA = MongooseModule.forFeature([
	{
		name: Nomina.name,
		schema: NominaSchema
	}
]);


export const _CAJACHICASCHEMA = MongooseModule.forFeature([
	{
		name: CajaChica.name,
		schema: CajaChicaSchema
	}
]);

export const _GASTOSOPSCHEMA = MongooseModule.forFeature([
	{
		name: GastosOperacion.name,
		schema: GastosOperacionSchema
	}
]);

export const _SALARIOSCHEMA = MongooseModule.forFeature([
	{
		name: Salario.name,
		schema: SalarioSchema
	}
]);