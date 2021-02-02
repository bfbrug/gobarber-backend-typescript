import AppError from '@shared/errors/AppError';

import FakeAppoinmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppoinmentService from './CreateAppoinmentService';

let fakeAppoinmentRepository: FakeAppoinmentRepository;
let createAppoinmentService: CreateAppoinmentService;

describe('CreateAppoinment', () => {
  beforeEach(() => {
    fakeAppoinmentRepository = new FakeAppoinmentRepository();
    createAppoinmentService = new CreateAppoinmentService(
      fakeAppoinmentRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppoinmentService.execute({
      date: new Date(),
      user_id: '123456',
      provider_id: '123456',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appoimentDate = new Date();

    await createAppoinmentService.execute({
      date: appoimentDate,
      user_id: '123456',
      provider_id: '123456',
    });

    expect(
      createAppoinmentService.execute({
        date: appoimentDate,
        user_id: '123456',
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
