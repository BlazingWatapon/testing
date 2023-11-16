import { expect } from 'chai';
import UserModel from '../user.model';
import db from '../../database';
import User from '../../types/user.type';

const userModel = new UserModel();

describe('User Model', () => {
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
    it('should have a Get Many Users method', () => {
      expect(userModel.getMany).to.be.a('function');
    });

    it('should have a Get One User method', () => {
      expect(userModel.getOne).to.be.a('function');
    });

    it('should have a Create User method', () => {
      expect(userModel.create).to.be.a('function');
    });

    it('should have an Update User method', () => {
      expect(userModel.updateOne).to.be.a('function');
    });

    it('should have a Delete User method', () => {
      expect(userModel.deleteOne).to.be.a('function');
    });

    it('should have an Authenticate User method', () => {
      expect(userModel.authenticate).to.be.a('function');
    });
  });

  describe('Test User Model Logic', () => {
    it('Create method should return a New User', async () => {
      const createdUser = await userModel.create({
        email: 'test2@test.com',
        user_name: 'test2User',
        first_name: 'Test',
        last_name: 'User',
        password: 'test123',
      } as User);
      expect(createdUser).to.include({
        email: 'test2@test.com',
        user_name: 'test2User',
        first_name: 'Test',
        last_name: 'User',
      });
    });

    it('Get Many method should return All available users in DB', async () => {
      const users = await userModel.getMany();
      expect(users).to.be.an('array');
      expect(users).to.have.lengthOf.at.least(2);
    });

    it('Get One method should return testUser when called with ID', async () => {
      const returnedUser = await userModel.getOne(user.id as string);
      expect(returnedUser).to.include({
        id: user.id,
        email: user.email,
        user_name: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
      });
    });

    it('Update One method should return a user with edited attributes', async () => {
      const updatedUser = await userModel.updateOne({
        ...user,
        user_name: 'testUser Updated',
        first_name: 'Mohammed',
        last_name: 'Elzanaty',
      });
      expect(updatedUser).to.include({
        id: user.id,
        email: user.email,
        user_name: 'testUser Updated',
        first_name: 'Mohammed',
        last_name: 'Elzanaty',
      });
    });

    it('Delete One method should delete user from DB', async () => {
      const deletedUser = await userModel.deleteOne(user.id as string);
      expect(deletedUser).to.include({ id: user.id });
    });
  });
});
