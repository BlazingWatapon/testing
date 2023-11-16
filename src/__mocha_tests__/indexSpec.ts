import { expect } from 'chai';
import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('Test endpoint response', () => {
    it('Gets the / endpoint', async () => {
      const response = await request.get('/')
      expect(response.status).to.equal(200)
    })
})
