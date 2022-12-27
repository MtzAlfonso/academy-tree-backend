import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = await this.prisma.user.create({
        data: {
          ...userData,
          roles: { set: userData?.roles || [Role.ALUMN] },
          password: bcrypt.hashSync(password, 10),
        },
        select: {
          id: true,
          email: true,
          name: true,
          lastname: true,
          roles: true,
          isActive: true,
          createdAt: true,
        },
      });

      return {
        user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  public async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user || !bcrypt.compareSync(password, user?.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const fullUser = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        lastname: true,
        roles: true,
        isActive: true,
      },
    });

    return { user: fullUser, token: this.getJwtToken({ id: user.id }) };
  }

  private getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private handleDatabaseError(error: any): never {
    console.log(error);
    if (error.code === 'P2002') {
      throw new BadRequestException("User's email already exists");
    }

    throw new InternalServerErrorException('Please try again later.');
  }
}
