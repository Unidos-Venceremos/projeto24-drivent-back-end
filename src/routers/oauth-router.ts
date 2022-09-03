import sessionRepository from '@/repositories/session-repository';
import userRepository from '@/repositories/user-repository';
import axios from 'axios';
import { Router } from 'express';

const oAuthRouter = Router();

oAuthRouter.post('/login', () => console.log("OAUTH 2"));

// async(req, res) => {
//     console.log('signInOauthPost');
//     const code = req.query.code;
//     const response = await axios.post(`https://github.com/login/oauth/access_token`, {
//       client_id: process.env.GITHUB_CLIENT_ID,
//       client_secret: process.env.GITHUB_CLIENT_SECRET,
//       code
//     });
  
//     const token = response.data.access_token;
//     const userResponse = await axios.get('https://api.github.com/user', {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     const user = await userRepository.findByEmail(userResponse.data.email);
//     if (!user){
//       await userRepository.create({
//         email: userResponse.data.email,
//         password: token,
//       });
//     }
//     await sessionRepository.create({
//       token,
//       userId: user.id,
//     });
//   }

export { oAuthRouter };