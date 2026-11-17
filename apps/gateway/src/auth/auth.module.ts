import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { UsersModule } from "../users/users.module.js";
import { AuthService } from "./auth.service.js";
import { JwtAuthGuard } from "./jwt-auth-guard.js";
import { AuthController } from "./auth.controller.js";


@Module({
    imports: [UsersModule],
    controllers: [AuthController],
    providers: [
        AuthService,{
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        }
    ],
    exports: [AuthService],
   
})

export class AuthModule {}