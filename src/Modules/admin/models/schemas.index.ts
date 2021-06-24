export { AdminSchema } from "./schemas/adminSchema";
export { License } from "./schemas/licenseSchema";
export { History } from "./schemas/historialSchema";

import { AdminSchema, Admin } from "./schemas/adminSchema";
import { License, LicenseSchema } from "./schemas/licenseSchema";
import { MongooseModule } from "@nestjs/mongoose";
import { History, HistSchema } from "./schemas/historialSchema";

export const _LICENSESCHEMA = MongooseModule.forFeature([
    {
        name: License.name,
        schema: LicenseSchema,
    },
]);

export const _ADMINSCHEMA = MongooseModule.forFeature([
    {
        name: Admin.name,
        schema: AdminSchema,
    },
]);

export const _HISTSCHEMA = MongooseModule.forFeature([
    {
        name: History.name,
        schema: HistSchema,
    },
]);