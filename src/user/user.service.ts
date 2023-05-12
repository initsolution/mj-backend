import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { Observable, switchMap, from, map, catchError, throwError } from 'rxjs';
import { LoginUsersDTO } from './dto/login-user.dto';

@Injectable()
export class UserService extends TypeOrmCrudService<User>{
  constructor(@InjectRepository(User) repo,
  @Inject(forwardRef(()=> AuthService))
    private authService: AuthService
  ) {
    super(repo)
  }
  
  create(user: CreateUserDto): Observable<User> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new User
        newUser.nama = user.nama
        newUser.email = user.email
        newUser.password = passwordHash
        newUser.role = user.role

        return from(this.repo.save(newUser)).pipe(
          map((usr: User) => {
            const { password, ...result } = usr
            return result
          }),
          catchError(err => throwError(err))
        )
      })
    )
  }
  
  update(id: number, user: UpdateUserDto): Observable<any> {
    try {
      if (user.password != null) {
        return this.authService.hashPassword(user.password).pipe(
          switchMap((passwordHash: string)=> {
            const newUser = new User
            newUser.nama = user.nama
            newUser.email = user.email
            newUser.role =user.role
            newUser.password = passwordHash
            
            return from(this.repo.update(id, newUser)).pipe(
              switchMap(()=> this.findOneUser(id))
            )
          })
        )
      } else {
        const {password, ...result} = user
        return from(this.repo.update(id, result)).pipe(
          switchMap(() => this.findOneUser(id))
        )
      }
    } catch (error) {
      throwError(error)
    }
    
  }
  
  findOneUser(id: number): Observable<User> {
    return from(this.repo.findOne({
      where: {
        id 
      },
      
    })).pipe(
      map((person: User) => {
        const { password, ...result } = person
        return result
      })
    );
  }
  
  findUserWithName(name: string): Observable<User> {
    return from(this.repo.findOne({where : {
      nama : name
    } }))

  }
  
  findUserWithEmail(email: string): Observable<User> {
    return from(this.repo.findOne({where : {
      email : email
    } }))

  }

  validatePassword(password: string, passwordStore: string): Observable<boolean> {
    return this.authService.comparePassword(password, passwordStore)
  }
  
  login(data: LoginUsersDTO): Observable<string> {
    // return this.findUserWithName(data.nama).pipe(
      if(data.email == null){
        return from('' + HttpStatus.NOT_FOUND)
      }else{
        return this.findUserWithEmail(data.email).pipe(
          switchMap((user: User) => {
            if (user) {//user ditemukan
              if (user.password) {//password ada
                return this.validatePassword(data.password, user.password).pipe(
                  switchMap((passwordMatches: boolean) => {
                    if (passwordMatches) {//password betul
                      return this.findOneUser(user.id).pipe(
                        switchMap((us: User) => this.authService.generateJWT(us))
                      )
                    } else { //password salah
                      return '' + HttpStatus.UNAUTHORIZED
                    }
                  })
                )
              } else {// password ga ada
    
              }
            } else { //user tidak ditemukan
              return '' + HttpStatus.NOT_FOUND
            }
          })
        )
      }
      
      
  }
}
