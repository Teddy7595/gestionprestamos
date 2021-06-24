import { RoleType } from '../role/models/roletype.enum';

export interface IJwtPayload {
  _id: string;
  email: string;
  rol: RoleType[];
  // subRole:
  // username: string;
  // iat?: Date;
  status: string;
  permisos?:any; 
}
