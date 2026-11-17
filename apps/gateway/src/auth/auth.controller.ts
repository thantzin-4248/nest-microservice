import { Controller, Get } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import type { UserContext } from "./auth.types.js";
import { CurrentUser } from "./current-user-decorator.js";

@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService: AuthService
    ){}

    @Get('me')

    me(@CurrentUser() user: UserContext){
        return {user};
    }
}