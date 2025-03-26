import { faker } from "@faker-js/faker/locale/en_US";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

async function main() {
  const users = Array.from({ length: 10 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    bio: faker.lorem.sentence(),
    avatar: faker.image.avatar()
  }));

  await prisma.user.createMany({ data: users });

  let postSlugs = new Set<string>();
  const posts = Array.from({ length: 40 }).map(() => {
    let title, slug;
    do {
      title = faker.book.title();
      slug = faker.helpers.slugify(title).toLowerCase();
    } while (postSlugs.has(slug));

    postSlugs.add(slug);

    return {
      title,
      slug,
      content: faker.lorem.paragraphs(3),
      thumbnail: faker.image.urlLoremFlickr(),
      published: true,
      userId: faker.number.int({ min: 1, max: 10 }),
    }
  });

  await Promise.all(
    posts.map(async(post) => await prisma.post.create({
      data: {
        ...post,
        comments: {
          createMany: {
            data: Array.from({ length: 20 }).map(() => ({
              content: faker.lorem.sentence(),
              userId: faker.number.int({ min: 1, max: 10 }),
            }))
          }
        }
      }
    }))
  );
}

main().then(() => {
  prisma.$disconnect();
  process.exit(0);
}).catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
