import { UserRoles } from 'src/modules/users/entities/user.entity';

export type AccessTokenPayload = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: UserRoles;
  updatedAt: Date;
  createdAt: Date;
};
