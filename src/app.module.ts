import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { CareersModule } from './careers/careers.module';
import { CoursesModule } from './courses/courses.module';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CoursesModule,
    CareersModule,
    UsersModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
