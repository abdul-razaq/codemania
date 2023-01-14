import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'IS_PUBLIC';

export function PublicRoute() {
  return SetMetadata(IS_PUBLIC, true);
}
