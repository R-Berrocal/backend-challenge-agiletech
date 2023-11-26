import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  CLIENT = 'CLIENT',
  TECHNICIAN = 'TECHNICIAN',
  ADMIN = 'ADMIN',
}

registerEnumType(UserRole, { name: 'UserRole' });
