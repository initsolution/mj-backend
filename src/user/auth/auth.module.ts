import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './local.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
    imports: [
        forwardRef(()=> UserModule),
        PassportModule,
        JwtModule.registerAsync({
            imports : [ConfigModule],
            inject : [ConfigService],
            useFactory : async (configService : ConfigService) => ({
                secret : configService.get('JWT_SECRET'),
                signOptions : {expiresIn : '30d'}
            })
        })
    ],
    providers: [AuthService, JwtStrategy, JwtAuthGuard],
    exports : [AuthService]
})
export class AuthModule {}
