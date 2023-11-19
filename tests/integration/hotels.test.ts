import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

const server = supertest(app);

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user has no enrollment', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(status).toBe(httpStatus.NOT_FOUND);
    });

    // it('should respond with status 404 when user has enrollment but has no ticket', async () => {});

    // it('should respond with status 404 when there are no hotels', async () => {});

    // it('should respond with status 402 when ticket is remote', async () => {});

    // it('should respond with status 402 when ticket is not paid', async () => {});

    // it('should respond with status 402 when ticket does not include hotel', async () => {});

    // it('should respond with status 200 and a list of hotels', async () => {});
  });
});
