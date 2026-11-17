import { SetMetadata } from '@nestjs/common';

export const REQUIRED_ROLE_KEY = 'requireRole';

export const AdminOnly = () => SetMetadata(REQUIRED_ROLE_KEY, 'admin');
