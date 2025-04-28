import { faker } from "@faker-js/faker/locale/en_US";
import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

async function main() {
  await prisma.$transaction(async (tx) => {
    const defaultPassword = await hash("123456");

    const usersData = Array.from({ length: 10 }).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email().replace(/_/g, '.').toLowerCase(),
      password: defaultPassword,
      bio: faker.lorem.sentence(),
      avatar: faker.image.avatar(),
    }));

    await tx.user.createMany({ data: usersData });

    const users = await tx.user.findMany();

    const postSlugs = new Set<string>();
    const posts = Array.from({ length: 40 }).map(() => {
      let title, slug;
      do {
        title = faker.book.title();
        slug = faker.helpers.slugify(title).toLowerCase();
      } while (postSlugs.has(slug));

      postSlugs.add(slug);

      const randomUser = faker.helpers.arrayElement(users);

      return {
        title,
        slug,
        content: faker.lorem.paragraphs(3),
        thumbnail: faker.image.urlPicsumPhotos({ width: 640, height: 480, grayscale: false, blur: 0 }),
        published: true,
        userId: randomUser.id,
      };
    });

    for (const post of posts) {
      await tx.post.create({
        data: {
          ...post,
          comments: {
            createMany: {
              data: Array.from({ length: 20 }).map(() => ({
                content: faker.lorem.sentence(),
                userId: faker.helpers.arrayElement(users).id,
              })),
            },
          },
        },
      });
    }
  });
}

main().then(() => {
  console.log("Seeding finished!");
  prisma.$disconnect();
  process.exit(0);
})
.catch((e) => {
  console.error("Seeding failed:", e);
  prisma.$disconnect();
  process.exit(1);
});
