import { EXPIRATION, prisma, redis } from '@/config';
import { invalidDataErrorGeneric, notFoundError } from '@/errors';
import addressRepository, { CreateAddressParams } from '@/repositories/address-repository';
import enrollmentRepository, { CreateEnrollmentParams } from '@/repositories/enrollment-repository';
import { exclude } from '@/utils/prisma-utils';
import { Address, Enrollment } from '@prisma/client';

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const cacheKey = `getOneWithAddressByUserId?userId=${userId}`;
  const cache = await redis.get(cacheKey);
  if (cache) {
    const cacheData: {
      address: GetAddressResult;
      id: number;
      name: string;
      cpf: string;
      birthday: Date;
      phone: string;
    } = JSON.parse(cache);

    return cacheData;
  } else {
    const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

    if (!enrollmentWithAddress) throw notFoundError();

    const [firstAddress] = enrollmentWithAddress.Address;
    const address = getFirstAddress(firstAddress);

    const data = {
      ...exclude(enrollmentWithAddress, 'userId', 'createdAt', 'updatedAt', 'Address'),
      ...(!!address && { address }),
    };

    redis.set(cacheKey, JSON.stringify(data));
    // redis.setEx(cacheKey, EXPIRATION, JSON.stringify(data));

    return data;
  }
}

type GetOneWithAddressByUserIdResult = Omit<Enrollment, 'userId' | 'createdAt' | 'updatedAt'>;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}

type GetAddressResult = Omit<Address, 'createdAt' | 'updatedAt' | 'enrollmentId'>;

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const enrollment = exclude(params, 'address');
  const address = getAddressForUpsert(params.address);

  try {
    await prisma.$transaction(async (prisma) => {
      const newEnrollment = await prisma.enrollment.upsert({
        where: {
          userId: params.userId,
        },
        create: enrollment,
        update: exclude(enrollment, 'userId'),
      });
      // const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, 'userId'));

      await prisma.address.upsert({
        where: {
          enrollmentId: newEnrollment.id,
        },
        create: {
          ...address,
          Enrollment: { connect: { id: newEnrollment.id } },
        },
        update: address,
      });
      // await addressRepository.upsert(newEnrollment.id, address, address);
    });
  } catch (error) {
    throw invalidDataErrorGeneric();
  }

  const cacheKey = `getOneWithAddressByUserId?userId=${params.userId}`;
  redis.del(cacheKey);
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
};

export default enrollmentsService;
