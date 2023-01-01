import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        alumns: true,
        professor: true,
      },
    });
  }

  async findAllProfessors() {
    const professors = await this.prisma.user.findMany({
      where: { roles: { hasSome: ['PROFESSOR'] } },
      select: {
        id: true,
        name: true,
        email: true,
        lastname: true,
        roles: true,
        isActive: true,
        avatar: true,
        cv: true,
        alumns: true,
        credential: true,
        userCourse: {
          select: {
            course: {
              include: {
                career: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return professors.map((professor) => {
      const { userCourse, ...rest } = professor;
      return {
        ...rest,
        career: userCourse.map((userCourse) => userCourse.course.career)[0],
        courses: userCourse.map((userCourse) => {
          const { course } = userCourse;
          delete course.career;
          return course;
        }),
      };
    });
  }

  async findAllAlumns(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { roles: { hasSome: ['ALUMN'] } },
      include: { professor: true },
    });
  }

  async findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
