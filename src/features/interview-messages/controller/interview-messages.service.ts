import { Injectable } from '@nestjs/common';

import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';
import GetInterviewMessageDto from './dto/get-interview-message.dto';
import PostInterviewMessageDto from './dto/post-interview-message.dto';
import ListInterviewMessagesDto, {
  ListInterviewMessagesParams,
} from './dto/list-interview-messages.dto';
import FindInterviewMessagesCase from '../use-cases/find-interview-messages.case';
import GetInterviewMessageByIdCase from '../use-cases/get-interview-message-by-id.case';
import AddInterviewMessageCase from '../use-cases/add-interview-message.case';

@Injectable()
export default class InterviewMessagesService {
  constructor(
    private readonly findInterviewMessagesCase: FindInterviewMessagesCase,
    private readonly getInterviewMessageByIdCase: GetInterviewMessageByIdCase,
    private readonly addInterviewMessageCase: AddInterviewMessageCase,
  ) {}

  public async getMessageById(
    id: Id,
    executor: UserEntity,
  ): Promise<GetInterviewMessageDto> {
    return await this.getInterviewMessageByIdCase.apply(id, executor);
  }

  public async findMessages(
    params: ListInterviewMessagesParams,
    executor: UserEntity,
  ): Promise<ListInterviewMessagesDto> {
    const items = await this.findInterviewMessagesCase.apply({
      ...params,
      executor,
    });

    return { items };
  }

  public async addMessage(
    dto: PostInterviewMessageDto,
    executor: UserEntity,
  ): Promise<GetInterviewMessageDto> {
    return await this.addInterviewMessageCase.apply({ ...dto, executor });
  }
}
