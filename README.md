# Modern Blog API with NestJS 🏗️

## Project setup

```bash
npm install
```

## Compile and run the project

```bash
npm run start:dev
```

## Run migrations
⚙️ Apply Database Migrations:
```bash
npx prisma migrate deploy
```
🌱 Seed Data (Optional):
```bash
npm run db:seed
```

## Visit GraphQL playground
```bash
http://localhost:3001/graphql
```

## 🛠 Resolve N+1 Problem in GraphQL with `graphql-parse-resolve-info`
⚠️ Issue: Prisma loads unnecessary relations even when not requested in GraphQL queries, causing N+1 issues.

🎯 Solution: Use `graphql-parse-resolve-info` to dynamically include only requested relations.
```bash
npm i graphql-parse-resolve-info
```

🖋️ Optimize Prisma Query in Service:
```bash
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';

findOne(id: number, info: GraphQLResolveInfo) {
  const fields = (parseResolveInfo(info)?.fieldsByTypeName?.Post || {}) as Record<string, ResolveTree>;

  return this.prisma.post.findUnique({
    where: { id },
    include: {
      user: !!fields.user,
      tags: !!fields.tags,
    },
  });
}
```

🖋️ Pass `info` in Resolver(similar to controllers in a RESTful API):
```bash
@Query(() => Post)
findPostById(@Args('id', { type: () => Int }) id: number, @Info() info: GraphQLResolveInfo) {
  return this.postService.findOne(id, info);
}
```

🌟 Handling Nested Relations:
If your GraphQL query includes nested fields (e.g., user { profile { avatar } }), standard Prisma queries may not optimize correctly. The graphql-parse-resolve-info library ensures only necessary nested relations are included.

🔍 Example GraphQL query:
```bash
query {
  findPostById(id: 1) {
    title
    user {
      name
      profile {
        avatar
      }
    }
    tags {
      name
    }
  }
}
```

🖋️ Updated Prisma query to handle nested fields:
```bash
findOne(id: number, info: GraphQLResolveInfo) {
  const fields = (parseResolveInfo(info)?.fieldsByTypeName?.Post || {}) as Record<string, ResolveTree>;

  return this.prisma.post.findUnique({
    where: { id },
    include: {
      user: fields.user ? {
        include: {
          profile: 'profile' in fields.user.fieldsByTypeName?.User || false
        }
      } : false,
      tags: !!fields.tags,
    },
  });
}
```

🔥 Benefits:
- Eliminates redundant SQL queries
- Loads only requested relations
- Optimizes performance, including nested queries
