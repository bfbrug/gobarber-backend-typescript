import { container } from 'tsyringe';

import HashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<HashProvider>('HashProvider', BCryptHashProvider);
