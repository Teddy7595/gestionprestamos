import { SetMetadata } from '@nestjs/common';

export const RolesDecorator = (...rol: string[]) => SetMetadata('rol', rol);
