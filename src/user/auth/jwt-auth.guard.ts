import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import dotenv = require('dotenv');
const { parsed } = dotenv.config({
  path: process.cwd() + '/.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});
process.env = { ...process.env, ...parsed };

@Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
  export class JwtAuthGuard implements CanActivate  {
    constructor(private jwtService: JwtService) {}
    
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token){
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token,{
        secret : process.env.JWT_SECRET,
      })
      request['user'] = payload.user
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true
    
    // const result = (await super.canActivate(context)) as boolean;
    // if (!result) {
    //   throw new HttpException('Token Expired', HttpStatus.UNAUTHORIZED);
    //   //   throw new UnauthorizedException('Token Expired');
    // }
    // return result;
  }
  
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}