import supertest from 'supertest';
import { expect } from 'chai';
import db from '../../database';
import UserModel from '../../models/user.model';
import User from '../../types/user.type';
import app from '../../index';

const userModel = new UserModel();
const request = supertest(app);
let token = '';

describe('User API Endpoints', () => {
  const user = {
    email: 'test@test.com',
    user_name: 'testUser',
    first_name: 'Test',
    last_name: 'User',
    password: 'test123',
  } as User;

  before(async () => {
    const createdUser = await userModel.create(user);
    user.id = createdUser.id;
  });

  after(async () => {
    const connection = await db.connect();
    try {
      const sql = 'DELETE FROM users;';
      await connection.query(sql);
    } finally {
      connection.release();
    }
  });

  describe('Test Authenticate methods', () => {
    it('should be able to authenticate to get token', async () => {
      const res = await request
        .post('/api/users/authenticate')
        .set('Content-type', 'application/json')
        .send({
          email: 'test@test.com',
          password: 'test123',
        });
      expect(res.status).to.equal(200);
      const { id, email, token: userToken } = res.body.data;
      expect(id).to.equal(user.id);
      expect(email).to.equal('test@test.com');
      token = userToken;
    });

    it('should fail to authenticate with wrong email', async () => {
      const res = await request
        .post('/api/users/authenticate')
        .set('Content-type', 'application/json')
        .send({
          email: 'wrong@email.com',
          password: 'test123',
        });
      expect(res.status).to.equal(401);
    });
  });

  describe('Test CRUD API methods', () => {
    it('should create new user', async () => {
      const res = await request
        .post('/api/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'test2@test2.com',
          user_name: 'testUser2',
          first_name: 'Test2',
          last_name: 'User2',
          password: 'test123',
        } as User);
      expect(res.status).to.equal(200);
      const { email, user_name, first_name, last_name } = res.body.data;
      expect(email).to.equal('test2@test2.com');
      expect(user_name).to.equal('testUser2');
      expect(first_name).to.equal('Test2');
      expect(last_name).to.equal('User2');
    });

    it('should get list of users', async () => {
      const res = await request
        .get('/api/users/')
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body.data.length).to.be.greaterThan(0);
    });

    it('should get user info', async () => {
      const res = await request
        .get(`/api/users/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body.data.user_name).to.equal('testUser');
      expect(res.body.data.email).to.equal('test@test.com');
    });

    it('should update user info', async () => {
      const res = await request
        .patch(`/api/users/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...user,
          user_name: 'mohammedelzanaty',
          first_name: 'Mohammed',
          last_name: 'Elzanaty',
        });
      expect(res.status).to.equal(200);
      const { id, email, user_name, first_name, last_name } = res.body.data;
      expect(id).to.equal(user.id);
      expect(email).to.equal(user.email);
      expect(user_name).to.equal('mohammedelzanaty');
      expect(first_name).to.equal('Mohammed');
      expect(last_name).to.equal('Elzanaty');
    });

    it('should delete user', async () => {
      const res = await request
        .delete(`/api/users/${user.id}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body.data.id).to.equal(user.id);
    });
  });
});