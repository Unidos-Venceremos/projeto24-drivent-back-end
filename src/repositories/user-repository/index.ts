import { prisma } from '@/config';
import { Prisma } from '@prisma/client';

async function findByEmail(email: string, select?: Prisma.UserSelect) {
  const params: Prisma.UserFindUniqueArgs = {
    where: {
      email,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.user.findUnique(params);
}

async function create(data: Prisma.UserUncheckedCreateInput) {
  return prisma.user.create({
    data,
  });
}

async function update(userEmail: string, newPassword: string) {
  return prisma.user.update({
    where: {
      email: userEmail,
    },
    data: {
      password: newPassword,
    },
  });
}

async function findUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      Bedroom: true,
    },
  });
}

async function attachBedroomIdToUser(userId: number, bedroomId: number) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      bedroomId,
    },
  });
}

const userRepository = {
  findByEmail,
  create,
  update,
  findUserById,
  attachBedroomIdToUser,
};

export default userRepository;
