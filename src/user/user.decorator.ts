import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const AuthUser = createParamDecorator((data, req :ExecutionContext) => {
    const request = req.switchToHttp().getRequest()
    const token = extractTokenFromHeader(request);
    // console.log(token)
    return request.user
})

export function extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }