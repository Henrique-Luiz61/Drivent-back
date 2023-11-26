import { prisma } from '@/config';

async function findRoomById(roomId: number) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: {
      capacity: true,
    },
  });

  return room;
}

async function findAllRoomsById(roomId: number) {
  const rooms = await prisma.room.count({
    where: { id: roomId },
  });

  return rooms;
}

export const roomRepository = {
  findRoomById,
  findAllRoomsById,
};
