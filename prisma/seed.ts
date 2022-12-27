import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.course.deleteMany();
  await prisma.career.deleteMany();
  const userCourses = await Promise.all([
    prisma.userCourse.create({
      data: {
        user: {
          create: {
            name: 'Juan',
            lastname: 'Perez',
            email: 'juanperez@gmail.com',
            password: bcrypt.hashSync('Test1234@', 10),
            roles: [Role.ALUMN],
          },
        },
        course: {
          create: {
            name: 'Desarrollo de Software',
            description: 'Desarrollo de Software',
            price: 100,
            career: {
              create: {
                name: 'Software',
                description: 'Software',
              },
            },
          },
        },
      },
    }),
    prisma.userCourse.create({
      data: {
        user: {
          create: {
            name: 'John',
            lastname: 'Doe',
            email: 'johndoe@gmail.com',
            password: bcrypt.hashSync('Test1234@', 10),
            roles: [Role.ALUMN],
          },
        },
        course: {
          create: {
            name: 'Fundamentos de Mecatronica',
            description: 'Fundamentos de Mecatronica',
            price: 80,
            career: {
              create: {
                name: 'Mecatronica',
                description: 'Mecatronica',
              },
            },
          },
        },
      },
    }),
    prisma.userCourse.create({
      data: {
        user: {
          create: {
            name: 'Ana',
            lastname: 'Gomez',
            email: 'anagomez@gmail.com',
            password: bcrypt.hashSync('Test1234@', 10),
            roles: [Role.ALUMN],
          },
        },
        course: {
          create: {
            name: 'Temas Selectos de Matematicas',
            description: 'Temas Selectos de Matematicas',
            price: 50,
            career: {
              create: {
                name: 'Matematicas',
                description: 'Matematicas',
              },
            },
          },
        },
      },
    }),
  ]);

  console.log({ userCourses });
}

// execute the main function
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
