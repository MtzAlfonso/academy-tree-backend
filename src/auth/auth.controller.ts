import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role, User } from '@prisma/client';

import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { UserRoleGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  public loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  public private(
    @GetUser() user: User,
    @GetUser('email') userEmail: User,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      ok: true,
      message: 'You have accessed a private route',
      user,
      userEmail,
      rawHeaders,
    };
  }

  @Get('private2')
  @RoleProtected(Role.ALUMN)
  @UseGuards(AuthGuard(), UserRoleGuard)
  public private2(@GetUser() user: User) {
    return {
      ok: true,
      message: 'You have accessed a private route',
      user,
    };
  }

  @Get('private3')
  @Auth(Role.ADMIN, Role.PROFESSOR)
  public private3(@GetUser() user: User) {
    return {
      ok: true,
      message: 'You have accessed a private route',
      user,
    };
  }

  @Get('user')
  @Auth()
  public user(@GetUser() user: User) {
    return {
      user,
    };
  }
}
