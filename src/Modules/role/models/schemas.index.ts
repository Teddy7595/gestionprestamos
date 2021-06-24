import { MongooseModule } from "@nestjs/mongoose";
import { Roles, RolesSchema } from "./schemas/roleSchema";



export const _ROLESSCHEMA = MongooseModule.forFeature([
  {
    name: Roles.name,
    schema: RolesSchema,
  },
]);
