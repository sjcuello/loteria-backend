import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InternalNotificationService } from './internal-notification.service';
import { InternalNotification } from './entities/internal-notification.entity';
import { User } from '../user/entities/user.entity';

describe('InternalNotificationService', () => {
  let service: InternalNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InternalNotificationService,
        {
          provide: getRepositoryToken(InternalNotification),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InternalNotificationService>(
      InternalNotificationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
