import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '@config/upload';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAutheticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const usersControler = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig);

usersRouter.post('/', usersControler.create);

usersRouter.patch(
  '/avatar',
  ensureAutheticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
