import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RawHeaders = createParamDecorator((_, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().rawHeaders;
});
