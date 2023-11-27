import supertest from 'supertest';
import httpStatus from 'http-status';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import { createHotel, createRoomWithHotelId } from '../factories/hotels-factory';
import {
  createBooking,
  createEnrollmentWithAddress,
  createPayment,
  createTicket,
  createTicketType,
  createUser,
} from '../factories';
import { prisma } from '@/config';
import app, { init } from '@/app';

const api = supertest(app);

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe('/booking tests', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await api.get('/hotels');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('GET/booking', () => {
    it('should respond with status 404', async () => {
      const token = await generateValidToken();
      const { status } = await api.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and room data', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const userId = user.id;

      const booking = await prisma.booking.create({
        data: {
          userId,
          roomId: room.id,
        },
      });

      const { status, body } = await api
        .get('/booking')
        .set('Authorization', `Bearer ${token}`)
        .set('userId', booking.userId.toString());
      expect(status).toBe(httpStatus.OK);
      expect(body).toMatchObject({
        id: expect.any(Number),
        Room: {
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });
  });
  describe('POST/booking', () => {
    it('should respond with status 401 if no token is given', async () => {
      const { status } = await api.post('/hotels');
      expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 404 when roomId dont exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const { status } = await api.post(`/booking`).set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
      expect(status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if user ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const { status } = await api.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket doenst include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, false);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const { status } = await api.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket is not paid ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const { status } = await api.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and bookingId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const { status, body } = await api
        .post(`/booking`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id });
      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual({ bookingId: expect.any(Number) });
    });
  });

  describe('PUT/booking/:bookingId', () => {
    it('should respond with status 401 if no token is given', async () => {
      const { status } = await api.put('/booking/1');
      expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 404 when roomId dont exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const { status } = await api.post(`/booking`).set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
      expect(status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if user ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const { status } = await api.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket does not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, false);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const { status } = await api.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when ticket is not paid ', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const { status } = await api.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and bookingId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const room2 = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const { status, body } = await api
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('userId', user.id.toString())
        .send({ roomId: room2.id });

      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual({ bookingId: expect.any(Number) });
    });
  });
});
