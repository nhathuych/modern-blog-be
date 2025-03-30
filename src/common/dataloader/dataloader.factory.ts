import * as DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// This is a data type that helps TypeScript understand that a Prisma model must have these methods  
interface PrismaModel {
  findMany: (args: any) => Promise<any[]>;
  findUnique: (args: any) => Promise<any>;
  findFirst: (args: any) => Promise<any>;
  // Add other query methods if needed
}

@Injectable({ scope: Scope.REQUEST })
export class DataLoaderFactory {
  constructor(private prisma: PrismaService) {}

  // Ensure that the model is a string
  createOneToOneLoader<T>(model: string, foreignKey: string = 'id') {
    return new DataLoader<number, T>(async (ids: readonly number[]) => {
      // Cast the model to Prisma type
      const prismaModel = this.prisma[model] as unknown as PrismaModel;
      const items = await prismaModel.findMany({
        where: { [foreignKey]: { in: [...ids] } },
      });
      
      return ids.map(id => items.find(item => item[foreignKey] === id) || null);
    });
  }
  
  // model: prisma model name (e.g., 'tag')
  // relationField: relationship field name in the entity (e.g., 'posts')
  createManyToManyLoader<T>(model: string, relationField: string, foreignKey: string = 'id') {
    return new DataLoader<number, T[]>(async (ids: readonly number[]) => {
      // Cast the model to Prisma type
      const prismaModel = this.prisma[model] as unknown as PrismaModel;
      const items = await prismaModel.findMany({
        where: {
          [relationField]: {
            some: { [foreignKey]: { in: [...ids] } }
          }
        },
        include: {
          [relationField]: {
            select: { [foreignKey]: true }
          }
        }
      });
      
      return ids.map(id => {
        return items
          .filter(item => item[relationField].some(rel => rel[foreignKey] === id))
          .map(item => {
            const { [relationField]: _, ...itemWithoutRelation } = item;
            return itemWithoutRelation as any;
          });
      });
    });
  }
}
