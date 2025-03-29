import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

enum SqlColor {
  SELECT = '\x1b[1m\x1b[34m',
  INSERT = '\x1b[1m\x1b[32m',
  UPDATE = '\x1b[1m\x1b[33m',
  DELETE = '\x1b[1m\x1b[31m',
  TRANSACTION = '\x1b[1m\x1b[35m',
  RESET = '\x1b[1m\x1b[0m',
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        "error",
        "info",
        "warn",
        { emit: "event", level: "query" },
      ],
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('query' as Prisma.LogLevel, (e: Prisma.QueryEvent) => {
      this.logColoredSql(e);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  private logColoredSql(e) {
    let sql = e.query;
    const params = `${SqlColor.RESET}${e.params}${SqlColor.RESET}`;
    const duration = `${SqlColor.UPDATE}+${e.duration}ms${SqlColor.RESET}`

    switch (true) {
      case /^select/i.test(sql):
        sql = `${SqlColor.SELECT}${sql}${SqlColor.RESET}`;
        break;
      case /^insert/i.test(sql):
        sql = `${SqlColor.INSERT}${sql}${SqlColor.RESET}`;
        break;
      case /^update/i.test(sql):
        sql = `${SqlColor.UPDATE}${sql}${SqlColor.RESET}`;
        break;
      case /^delete/i.test(sql):
        sql = `${SqlColor.DELETE}${sql}${SqlColor.RESET}`;
        break;
      case /^(begin|commit|rollback)/i.test(sql):
        sql = `${SqlColor.TRANSACTION}${sql}${SqlColor.RESET}`;
        break;
    }

    console.log(`${sql} ${params} ${duration}`);
  }
}
