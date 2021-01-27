import AppError from '@shared/errors/AppError';

import FakeAppoinmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppoinmentService from './CreateAppoinmentService';

describe('CreateAppoinment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppoinmentRepository = new FakeAppoinmentRepository();
    const createAppoinmentService = new CreateAppoinmentService(
      fakeAppoinmentRepository,
    );

    const appointment = await createAppoinmentService.execute({
      date: new Date(),
      provider_id: '123456',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppoinmentRepository = new FakeAppoinmentRepository();
    const createAppoinmentService = new CreateAppoinmentService(
      fakeAppoinmentRepository,
    );

    const appoimentDate = new Date();

    await createAppoinmentService.execute({
      date: appoimentDate,
      provider_id: '123456',
    });

    expect(
      createAppoinmentService.execute({
        date: appoimentDate,
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
