import authenticationService, { SignInParams } from '@/services/authentication-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import qs from "query-string";
import axios from 'axios';
import userRepository from '@/repositories/user-repository';
import sessionRepository from '@/repositories/session-repository';


export async function signInOauthPost(req: Request, res: Response) {
  console.log('signInOauthPost');
  const code = req.query.code;
	const response = await axios.post(`https://github.com/login/oauth/access_token`, {
		client_id: process.env.GITHUB_CLIENT_ID,
		client_secret: process.env.GITHUB_CLIENT_SECRET,
		code
	});

	const token = response.data.access_token;
	const userResponse = await axios.get('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	const user = await userRepository.findByEmail(userResponse.data.email);
	if (!user){
    await userRepository.create({
      email: userResponse.data.email,
      password: token,
    });
  }
  await sessionRepository.create({
    token,
    userId: user.id,
  });
}