import Role from './role.enum';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

const RoleGuard = (role: Role): Type<CanActivate> => {
    class RoleGuardMixin implements CanActivate {
        canActivate(context: ExecutionContext) {
            const request = context.switchToHttp().getRequest<Request>();
            const user: any = request.body;

            return user?.role.includes(role);
        }
    }

    return mixin(RoleGuardMixin);
}

export default RoleGuard;