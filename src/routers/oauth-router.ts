import { signInOauthPost } from '@/controllers/oauth-controller';
import { Router } from 'express';

const oauthRouter = Router();

oauthRouter.post('/oauth', 
/*validateBody(signInSchema), */
signInOauthPost);

export { oauthRouter };