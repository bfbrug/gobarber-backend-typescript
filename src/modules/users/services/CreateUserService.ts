import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUseService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, email, password }: Request): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email addres already used.');
    }

    const hashPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashPassword,
    });

    return user;
  }
}

export default CreateUseService;
