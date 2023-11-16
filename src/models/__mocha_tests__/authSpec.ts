import { expect } from 'chai';
import UserModel from '../user.model';
import db from '../../database';
import User from '../../types/user.type';

const userModel = new UserModel();

describe('Authentication Module', () => {
  let user = {
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

  describe('Test methods exists', () => {
    it('should have an Authenticate User method', () => {
      expect(userModel.authenticate).to.be.a('function');
    });
  });

  describe('Test Authentication Logic', () => {
    it('Authenticate method should return the authenticated user', async () => {
      const authenticatedUser = await userModel.authenticate(user.email, user.password as string);
      expect(authenticatedUser).to.be.an('object');
      expect(authenticatedUser?.email).to.equal(user.email);
      expect(authenticatedUser?.user_name).to.equal(user.user_name);
      expect(authenticatedUser?.first_name).to.equal(user.first_name);
      expect(authenticatedUser?.last_name).to.equal(user.last_name);
    });

    it('Authenticate method should return null for wrong credentials', async () => {
      const authenticatedUser = await userModel.authenticate('mohammed@elzanaty.com', 'fake-password');
      expect(authenticatedUser).to.be.null;
    });
  });
});
