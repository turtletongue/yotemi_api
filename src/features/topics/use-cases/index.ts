import AddTopicCase from './add-topic.case';
import DeleteTopicCase from './delete-topic.case';
import UpdateTopicCase from './update-topic.case';
import FindTopicsCase from './find-topics.case';
import GetTopicByIdCase from './get-topic-by-id.case';

const topicUseCases = [
  AddTopicCase,
  DeleteTopicCase,
  UpdateTopicCase,
  FindTopicsCase,
  GetTopicByIdCase,
];

export default topicUseCases;
