import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const UserDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = JwtService.prototype.decode(
      request.header('authorization').split(' ')[1],
    );
    return { _id: user._id, role: user.role };
  },
);
