import { prisma } from '@/config';

async function getLocals() {
  const locals = await prisma.local.findMany();
  return locals;
}

export default { getLocals };
