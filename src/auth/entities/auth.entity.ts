export class Auth {
  id: string;
  username: string;
  fullname: string;
  password: string;
}

export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
}
