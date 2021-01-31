// import AppError from '@shared/errors/AppError';

import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
  });

  it('should be able authenticate', async () => {
    const user = await createUser.execute({
      name: 'João da Silva',
      email: 'joao@example.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'joao@example.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'joao@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able authenticate with wron passwor', async () => {
    await createUser.execute({
      name: 'João da Silva',
      email: 'joao@example.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'joao@example.com',
        password: 'wrong-passwor',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
