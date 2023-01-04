import { Injectable } from '@nestjs/common';

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

  public async findTopics(params: ListTopicsParams): Promise<ListTopicsDto> {
    return await this.findTopicsCase.apply(params);
  }

  public async addTopic(dto: PostTopicDto): Promise<GetTopicDto> {
    return await this.addTopicCase.apply(dto);
  }

  public async updateTopic(dto: PatchTopicDto): Promise<GetTopicDto> {
    return await this.updateTopicCase.apply(dto);
  }

  public async deleteTopic(id: Id): Promise<GetTopicDto> {
    return await this.deleteTopicCase.apply({ id });
  }
}
