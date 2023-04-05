import { Injectable } from '@nestjs/common';

import { AdminEntity } from '@features/admins/entities';
import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';
import GetTopicDto from './dto/get-topic.dto';
import ListTopicsDto, { ListTopicsParams } from './dto/list-topics.dto';
import PostTopicDto from './dto/post-topic.dto';
import PatchTopicDto from './dto/patch-topic.dto';
import GetTopicByIdCase from '../use-cases/get-topic-by-id.case';
import FindTopicsCase from '../use-cases/find-topics.case';
import AddTopicCase from '../use-cases/add-topic.case';
import UpdateTopicCase from '../use-cases/update-topic.case';
import DeleteTopicCase from '../use-cases/delete-topic.case';

@Injectable()
export default class TopicsService {
  constructor(
    private readonly getTopicByIdCase: GetTopicByIdCase,
    private readonly findTopicsCase: FindTopicsCase,
    private readonly addTopicCase: AddTopicCase,
    private readonly updateTopicCase: UpdateTopicCase,
    private readonly deleteTopicCase: DeleteTopicCase,
  ) {}

  public async getTopicById(id: Id): Promise<GetTopicDto> {
    return await this.getTopicByIdCase.apply(id);
  }

  public async findTopics(
    params: ListTopicsParams,
    executor?: UserEntity,
  ): Promise<ListTopicsDto> {
    return await this.findTopicsCase.apply({ ...params, executor });
  }

  public async addTopic(
    dto: PostTopicDto,
    executor: AdminEntity | UserEntity,
  ): Promise<GetTopicDto> {
    return await this.addTopicCase.apply(dto, executor);
  }

  public async updateTopic(dto: PatchTopicDto): Promise<GetTopicDto> {
    return await this.updateTopicCase.apply(dto);
  }

  public async deleteTopic(id: Id): Promise<GetTopicDto> {
    return await this.deleteTopicCase.apply({ id });
  }
}
