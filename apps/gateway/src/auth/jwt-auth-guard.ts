import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UsersService } from "../users/users.service.js";
import { AuthService } from "./auth.service.js";
import { REQUIRED_ROLE_KEY } from "./admin.decorator.js";
import { UserContext } from "./auth.types.js";
import { IS_PUBLIC_KEY } from "./public.decorator.js";

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService,
        private readonly userService: UsersService

    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY,[
            context.getHandler(),
            context.getClass()
        ])

        if(isPublic) {
            return true;
        }

        const req = context.switchToHttp().getRequest<{
            headers: { authorization?: string };
            user?: UserContext;
        }>();
        const authorization = req.headers['authorization'];

        if(!authorization || typeof authorization !== 'string')
        {
            throw new UnauthorizedException('Missing authorization header');
        }

        const token = authorization.startsWith('Bearer ')
            ? authorization.slice('Bearer '.length).trim()
            : '';

        if(!token){
            throw new UnauthorizedException('Missing token')
        }

        const identifyAuthUser = await this.authService.verifyAndBuildContext(token);
        const dbUser = await this.userService.upsertAuthUser({
            clerkUserId: identifyAuthUser.clerkUserId,
            email: identifyAuthUser.email,
            name: identifyAuthUser.name
        });

        if(!dbUser){
            throw new UnauthorizedException('Unable to load authenticated user');
        }

        const user: UserContext = {
            ...identifyAuthUser,
            role: dbUser.role,
        };

        req.user = user;

        const requiredRole = this.reflector.getAllAndOverride<string>(REQUIRED_ROLE_KEY,[
            context.getHandler(),
            context.getClass()
        ])

        if(requiredRole && user.role !== requiredRole){
            throw new ForbiddenException('Admin access required')
        }

        return true;
    }
}
