import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { User } from '../users/users.entity';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ) {
        const request: User = context.switchToHttp().getRequest();

        if (!request.verify_at) {
            throw new UnauthorizedException('Confirm your email first');
        }

        return true;
    }
}