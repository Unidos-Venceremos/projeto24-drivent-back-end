import { Request, Response } from 'express';
import axios from 'axios';
import qs from 'query-string';
import userRepository from '@/repositories/user-repository';
import sessionRepository from '@/repositories/session-repository';
import userService from '@/services/users-service';
import httpStatus from 'http-status';


export async function signInOauthPost(req: Request, res: Response) {
  const code = req.body.code;
  const token = await exchangeCodeForAccessToken(req.body.code);
  const userEmail = await fetchUserEmail(token);

  const user = await userService.createUserWithToken({ 
    email: userEmail, 
    password: token.toString() 
  });
    
  res.status(httpStatus.CREATED).send({
    user:{
      id: user.id,
      email: user.email,
    },
    token,
  });
}

async function exchangeCodeForAccessToken(code: string) {
  const GITHUB_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
  const {GITHUB_REDIRECT_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = process.env;
  const params = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: GITHUB_REDIRECT_URL,
    client_id: GITHUB_CLIENT_ID, 
    client_secret: GITHUB_CLIENT_SECRET,
  };

  const { data } = await axios.post(GITHUB_ACCESS_TOKEN_URL, params, {
    headers: {
      'Content-Type': 'application/json'
    },
  });

  const parsedData = qs.parse(data);
  return parsedData.access_token;
}

async function fetchUserEmail(token: any) {
  const response = await axios.get("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
    
  return response.data[0].email;
}