import { EXPIRATION, redis } from '@/config';
import { cannotEnrollBeforeStartDateError } from '@/errors';
import userRepository from '@/repositories/user-repository';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import eventsService from '../events-service';
import { duplicatedEmailError } from './errors';

export async function createUser({ email, password }: CreateUserParams): Promise<User> {
  await canEnrollOrFail();

  await validateUniqueEmailOrFail(email);

  const hashedPassword = await bcrypt.hash(password, 12);
  return userRepository.create({
    email,
    password: hashedPassword,
  });
}

export async function createUserWithToken({ email, password }: CreateUserParams): Promise<User> {
  await canEnrollOrFail();

  try {
    await validateUniqueEmailOrFail(email);
    return userRepository.create({
      email,
      password: password,
    });
  } catch(error) {
    return userRepository.update(email, password);
  }  
}

async function validateUniqueEmailOrFail(email: string) {
  const cacheKey = `validateEmail?email=${email}`;
  const cache = await redis.get(cacheKey);

  if (cache) {
    true;
  } else {
    const userWithSameEmail = await userRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw duplicatedEmailError();
    } else {
      redis.set(cacheKey, JSON.stringify(true));
      // redis.setEx(cacheKey, EXPIRATION, JSON.stringify(true));
    }
  }
}

async function canEnrollOrFail() {
  const canEnroll = await eventsService.isCurrentEventActive();
  if (!canEnroll) {
    throw cannotEnrollBeforeStartDateError();
  }
}

export type CreateUserParams = Pick<User, 'email' | 'password'>;

const userService = {
  createUser,
  createUserWithToken
};

export * from './errors';
export default userService;
