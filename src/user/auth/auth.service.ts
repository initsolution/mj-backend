import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service';
import { Observable, from, of } from 'rxjs';
import { User } from '../entities/user.entity';
const bcrypt = require('bcrypt')

@Injectable()
export class AuthService {
    constructor(private readonly jwtService : JwtService,
        @Inject(forwardRef(()=> UserService))
        private userService: UserService
        ){}
        
        hashPassword(password: string) : Observable<string> {
            return from<string> (bcrypt.hash(password, 12))
        }
        comparePassword(newPassword: string, passwordHash :string): Observable<any | boolean >{
            return of<any | boolean> (bcrypt.compareSync(newPassword, passwordHash))
        }
        
        generateJWT(user: User) : Observable<string>{ 
            return from(this.jwtService.signAsync({user}))
        }
        
        async validateUser(username: string, pass: string): Promise<any> {
            const user = await this.userService.findOne({where : {nama : username}});
            if (user && user.password === bcrypt.hash(pass, 12)) {
              const { password, ...result } = user;
              return result;
            }
            return null;
          }
    
}
