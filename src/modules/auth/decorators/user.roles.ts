import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
// decorator to define the role of a user for authorization purposes.
// The @Roles() can be used on any controller or method in order to specify which users are allowed access,
// based upon their assigned roles
// within an organizational structure (e.g., admin vs regular).
