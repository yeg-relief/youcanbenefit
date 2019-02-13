import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { DbElasticsearchModule } from '../db.elasticsearch/db.elasticsearch.module';
import { QuestionDto } from './question.dto';
import { ProgramService } from '../Program/program.service';
import { EsQueryService } from '../query/EsQuery.service';

describe('QuestionService', () => {
  let questionService: QuestionService;
  const mockQuestions: QuestionDto[] = [
    new QuestionDto({
      text: "test text 1",
      id: "test_id1",
      type: "boolean"
    }),
    new QuestionDto({
      text: "test text 2",
      id: "test_id2",
      type: "integer"
    })
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbElasticsearchModule],
      providers: [QuestionService,
                  EsQueryService],
    }).compile();

    questionService = module.get<QuestionService>(QuestionService);
  });

  it('should be defined', () => {
    expect(questionService).toBeDefined();
  });

  describe('getQuestions', () => {
    it ('should return an array of questions', async () => {
      const result: QuestionDto[] = [
        new QuestionDto({
          text: "test text",
          id: "test_id",
          type: "boolean"
        })
      ];
      jest.spyOn(questionService, 'getQuestions').mockImplementation( () => result);

      const res = await questionService.getQuestions();
      expect(res).toMatchObject(result)
    })
  })

  describe('updateQuestions', () => {
    it ('should return an elasticsearch acknowledged response', async () => {
      const result = {
        "acknowledged": true
    };
    jest.spyOn(questionService, 'updateQuestions').mockImplementation(() => result);
    expect(await questionService.updateQuestions(mockQuestions)).toMatchObject(result);
    })
  })

});
