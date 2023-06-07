import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { User } from './entities/user.entity';
import { Observable, map, catchError, of } from 'rxjs';
import { LoginUsersDTO } from './dto/login-user.dto';

@Crud({
  model: {
    type: User
  },
  dto: {
    create: CreateUserDto,
    update: UpdateUserDto
  }
})

@ApiTags('User')
@Controller('user')
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}

  get base(): CrudController<User> {
    return this;
  }

  @Override()
  async getMany(@ParsedRequest() req: CrudRequest){
    const result :any = await this.base.getManyBase(req)
    const newResult = []

    for(const user of result){
      delete user.password

      newResult.push(user)
    }
    return newResult
  }

  @Override('getOneBase')
  async getOne(@ParsedRequest() req: CrudRequest){
    let res : any = await this.base.getOneBase(req)
    delete res.password
    return res
  }
  
  @Post()
  create(@Body() person: CreateUserDto): Observable<User | object> {
    return this.service.create(person).pipe(
      map((person: User) => person),
      catchError(err => of({ error: err }))
    )
  }
  
  @Override('updateOneBase')
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: User): Observable<any> {
    console.log('update')
    console.log(dto)
    console.log(req.parsed.paramsFilter)
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id').value;
    console.log(filterId)
    return this.service.update(Number(filterId), dto)
  }

  @Post('login')
  async login(@Body() data: LoginUsersDTO): Promise<Observable<object>> {
    return this.service.login(data).pipe(
      map((resp: string) => {
        if (resp == "1") {
          return {
            message: 'Password salah',
            expires_in: 0,
            token_type: '-',
            statusCode: HttpStatus.UNAUTHORIZED
          }
        } else if (resp == '4') {
          return {
            message: 'User tidak ditemukan',
            expires_in: 0,
            token_type: '-',
            statusCode: HttpStatus.NOT_FOUND
          }
        }
        return {
          message: resp,
          expires_in: 300,
          token_type: 'jwt',
          statusCode: HttpStatus.ACCEPTED
        }
      })
    )
  }
  
  
}
