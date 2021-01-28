import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

describe('SendForgotPasswordEmail', () => {
  it('should be able to recover the password using the email', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
    );

    await fakeUserRepository.create({
      name: 'João da Silva',
      email: ' joao@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'joao@example.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be to recover a non-existind user password', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
    );

    await expect(
      sendForgotPasswordEmail.execute({
        email: 'joao@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeUserTokensRepository = new FakeUserTokensRepository();

    const fakeMailProvider = new FakeMailProvider();

    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
    );

    const user = await fakeUserRepository.create({
      name: 'João da Silva',
      email: ' joao@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'joao@example.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
