import { User, UserRole } from '@prisma/client';

export class UserResponseDto {
  id: string;

  email: string;

  firstName: string;

  lastName: string;

  phone: string | null;

  role: UserRole;

  isActive: boolean;

  isEmailVerified: boolean;

  createdAt: Date;

  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phone = user.phone;
    this.role = user.role;
    this.isActive = user.isActive;
    this.isEmailVerified = user.isEmailVerified;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
