import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  role: 'USER' | 'ADMIN';

  @Expose()
  phone?: string;

  @Expose()
  updatedAt: string;

  @Expose()
  createdAt: string;

  @Exclude()
  password: string;
}
