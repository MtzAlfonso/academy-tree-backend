import { Injectable } from '@nestjs/common';
import { Career } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

@Injectable()
export class CareersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCareerDto: CreateCareerDto) {
    return 'This action adds a new career';
  }

  async findAll(): Promise<Career[]> {
    return this.prisma.career.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} career`;
  }

  update(id: number, updateCareerDto: UpdateCareerDto) {
    return `This action updates a #${id} career`;
  }

  remove(id: number) {
    return `This action removes a #${id} career`;
  }
}
