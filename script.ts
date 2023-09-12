import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function createUsers() {
  const users = await prisma.user.createMany({
    data: [
      {
        name: "Kyle",
        email: "kyle@gmail.com",
        age: 27,
      },
      {
        name: "Sally",
        email: "sally@gmail.com",
        age: 35,
      },
    ],
  });
  return users;
}

async function createUser() {
  const user = await prisma.user.create({
    data: {
      name: "Kyle",
      email: "kyle@gmail.com",
      age: 27,
      userPreference: {
        create: {
          emailUpdates: true,
        },
      },
    },
    include: {
      userPreference: true,
    },
  });
  return user;
}

// Delete single
async function deleteUser() {
  const user = await prisma.user.delete({
    where: {
      email: "kyle@gmail.com",
    },
  });
}

// Delete Many
async function deleteUsers() {
  await prisma.user.deleteMany();
}

async function getUniqueUser() {
  const user = await prisma.user.findUnique({
    where: {
      age_name: {
        age: 27,
        name: "Kyle",
      },
    },
  });
  return user;
}

async function getFirstUser() {
  const user = await prisma.user.findFirst({
    where: {
      name: "Sally",
    },
  });
  return user;
}

async function getManyUsers() {
  const users = await prisma.user.findMany({
    where: {
      AND: [
        // Can also have OR and NOT
        // name: "Sally"
        { name: { equals: "Sally" } },
        //   name: { not: "Sally" },
        //   name: { in: ["Sally", "Kyle"] },
        //   name: { notIn: ["Sally", "Kyle"] },
        { age: { lt: 20 } },
        //   age: { gt: 20 },
        //   age: { lte: 20 },
        //   age: { gte: 20 },
        { email: { contains: "@gmail.com" } },
        //   email: { endsWith: "@gmail.com" },
        //   email: { startsWith: "kyle" },
        { userPreference: { emailUpdates: true } },
        {
          writtenPosts: {
            every: {
              title: "Test",
            },
          },
        },
        {
          writtenPosts: {
            none: {
              title: "Test",
            },
          },
        },
        {
          writtenPosts: {
            some: {
              title: { startsWith: "Test" },
            },
          },
        },
      ],
    },
    // distinct: ["name", "age"]
    // take: 2,
    // skip: 1
    // orderBy: {
    //     age: "asc"
    // }
  });
  return users;
}

// Relationship filter
async function postRelFil() {
  const user = await prisma.post.findMany({
    where: {
      author: {
        is: {
          age: 27,
        },
        isNot: {
          name: "Kyle",
        },
      },
    },
  });
}

// Updating data - single
async function updateUser() {
  const user = await prisma.user.update({
    where: {
      email: "kyle@gmail.com",
    },
    data: {
      email: "Kyle@gmail.com",
      age: {
        // increment: 1,
        // decrement: 1,
        // multiply: 10,
        divide: 1,
      },
      userPreference: {
        create: {
          emailUpdates: true,
        },
        // connect: {
        //     id: 'some id'
        // },
        // disconnect: {
        //   id: "some id",
        // },
        // disconnect: true, // If you have a 1-to-1 relationship
      },
    },
  });
}

// Updating many
async function updateUsers() {
  const users = await prisma.user.updateMany({
    where: {
      name: "Kyle",
    },
    data: {
      email: "kyle@gmail.com",
    },
  });
}

async function main() {
  const users = await prisma.user.findMany({
    where: {
      name: "Sally",
    },
  });
  console.log(users);
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
