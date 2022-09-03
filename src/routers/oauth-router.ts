import { signInOauthPost } from '@/controllers/oauth-controller';
import sessionRepository from '@/repositories/session-repository';
import userRepository from '@/repositories/user-repository';
import axios from 'axios';
import { Router } from 'express';

const oauthRouter = Router();

oauthRouter.post('/', signInOauthPost);

export { oauthRouter };