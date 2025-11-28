import { Test, TestingModule } from '@nestjs/testing';
import { InternalNotificationController } from './internal-notification.controller';
import { InternalNotificationService } from './internal-notification.service';

describe('InternalNotificationController', () => {
  let controller: InternalNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternalNotificationController],
      providers: [
        {
          provide: InternalNotificationService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByUser: jest.fn(),
            findUnreadByUser: jest.fn(),
            update: jest.fn(),
            markAsRead: jest.fn(),
            markAllAsReadByUser: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InternalNotificationController>(
      InternalNotificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
