import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@common/prisma';
import { PaginationResult, PaginationService } from '@common/pagination';
import { Id } from '@app/app.declarations';
import BuildTopicDto from './entities/dto/build-topic.dto';
import { PlainTopic, TopicEntity, TopicFactory } from './entities';
import { TopicNotFoundException } from './exceptions';

const includeLabelsOptions = {
  select: {
    id: true,
    value: true,
    language: true,
  },
};

@Injectable()
export default class TopicsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
    private readonly topicFactory: TopicFactory,
  ) {}

  public async findById(id: Id): Promise<TopicEntity> {
    const topic = await this.prisma.topic
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          labels: includeLabelsOptions,
        },
      })
      .catch(() => {
        throw new TopicNotFoundException();
      });

    return await this.topicFactory.build(topic);
  }

  public async findPaginated(
    page: number,
    limit: number,
    options?: Prisma.TopicFindManyArgs,
  ): Promise<PaginationResult<TopicEntity>> {
    const paginated = await this.pagination.paginate<BuildTopicDto>(
      this.prisma.topic,
      page,
      limit,
      {
        ...(options ?? {}),
        include: {
          labels: includeLabelsOptions,
        },
      },
    );

    return {
      ...paginated,
      items: await Promise.all(
        paginated.items.map(
          async (topic) => await this.topicFactory.build(topic),
        ),
      ),
    };
  }

  public async findByIds(ids: Id[] = []): Promise<TopicEntity[]> {
    const topics = await this.prisma.topic.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        labels: includeLabelsOptions,
      },
    });

    return await Promise.all(
      topics.map(async (topic) => await this.topicFactory.build(topic)),
    );
  }

  public async create(topic: PlainTopic): Promise<TopicEntity> {
    const { labels, ...data } = topic;

    const result = await this.prisma.topic.create({
      data: {
        ...data,
        labels: {
          create: labels,
        },
      },
      include: {
        labels: includeLabelsOptions,
      },
    });

    return await this.topicFactory.build(result);
  }

  public async update(
    topic: Partial<PlainTopic> & Pick<PlainTopic, 'id'>,
  ): Promise<TopicEntity> {
    const existingTopic = await this.findById(topic.id);

    const { labels, ...data } = topic;

    const result = await this.prisma.$transaction(async (prisma) => {
      await prisma.topicLabel.deleteMany({
        where: {
          id: {
            notIn: labels.filter(({ id }) => !!id).map(({ id }) => id),
          },
        },
      });

      await Promise.all(
        labels.map(async (label) => {
          await prisma.topicLabel.upsert({
            where: {
              id: label.id,
            },
            create: { ...label, topicId: topic.id },
            update: label,
          });
        }),
      );

      return await prisma.topic.update({
        where: {
          id: existingTopic.id,
        },
        data,
        include: {
          labels: includeLabelsOptions,
        },
      });
    });

    return await this.topicFactory.build(result);
  }

  public async delete(id: Id): Promise<TopicEntity> {
    const existingTopic = await this.findById(id);

    const result = await this.prisma.topic.delete({
      where: {
        id: existingTopic.id,
      },
      include: {
        labels: includeLabelsOptions,
      },
    });

    return await this.topicFactory.build(result);
  }
}
