import { PrismaClient } from '@prisma/client';

export type Id = string;

export type ClassType = abstract new (...args: any) => any;

export type Model = PrismaClient[keyof Omit<
  PrismaClient,
  | '$disconnect'
  | '$connect'
  | '$executeRaw'
  | '$executeRawUnsafe'
  | '$queryRaw'
  | '$queryRawUnsafe'
  | '$transaction'
  | '$use'
  | '$on'
>];
