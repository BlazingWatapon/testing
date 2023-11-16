"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const chai_1 = require("chai");
const database_1 = __importDefault(require("../../database"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const index_1 = __importDefault(require("../../index"));
const userModel = new user_model_1.default();
const request = (0, supertest_1.default)(index_1.default);
let token = '';
describe('User API Endpoints', () => {
    const user = {
        email: 'test@test.com',
        user_name: 'testUser',
        first_name: 'Test',
        last_name: 'User',
        password: 'test123',
    };
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield userModel.create(user);
        user.id = createdUser.id;
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield database_1.default.connect();
        try {
            const sql = 'DELETE FROM users;';
            yield connection.query(sql);
        }
        finally {
            connection.release();
        }
    }));
    describe('Test Authenticate methods', () => {
        it('should be able to authenticate to get token', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .post('/api/users/authenticate')
                .set('Content-type', 'application/json')
                .send({
                email: 'test@test.com',
                password: 'test123',
            });
            (0, chai_1.expect)(res.status).to.equal(200);
            const { id, email, token: userToken } = res.body.data;
            (0, chai_1.expect)(id).to.equal(user.id);
            (0, chai_1.expect)(email).to.equal('test@test.com');
            token = userToken;
        }));
        it('should fail to authenticate with wrong email', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .post('/api/users/authenticate')
                .set('Content-type', 'application/json')
                .send({
                email: 'wrong@email.com',
                password: 'test123',
            });
            (0, chai_1.expect)(res.status).to.equal(401);
        }));
    });
    describe('Test CRUD API methods', () => {
        it('should create new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .post('/api/users/')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                email: 'test2@test2.com',
                user_name: 'testUser2',
                first_name: 'Test2',
                last_name: 'User2',
                password: 'test123',
            });
            (0, chai_1.expect)(res.status).to.equal(200);
            const { email, user_name, first_name, last_name } = res.body.data;
            (0, chai_1.expect)(email).to.equal('test2@test2.com');
            (0, chai_1.expect)(user_name).to.equal('testUser2');
            (0, chai_1.expect)(first_name).to.equal('Test2');
            (0, chai_1.expect)(last_name).to.equal('User2');
        }));
        it('should get list of users', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .get('/api/users/')
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.length).to.be.greaterThan(0);
        }));
        it('should get user info', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .get(`/api/users/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.user_name).to.equal('testUser');
            (0, chai_1.expect)(res.body.data.email).to.equal('test@test.com');
        }));
        it('should update user info', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .patch(`/api/users/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(Object.assign(Object.assign({}, user), { user_name: 'mohammedelzanaty', first_name: 'Mohammed', last_name: 'Elzanaty' }));
            (0, chai_1.expect)(res.status).to.equal(200);
            const { id, email, user_name, first_name, last_name } = res.body.data;
            (0, chai_1.expect)(id).to.equal(user.id);
            (0, chai_1.expect)(email).to.equal(user.email);
            (0, chai_1.expect)(user_name).to.equal('mohammedelzanaty');
            (0, chai_1.expect)(first_name).to.equal('Mohammed');
            (0, chai_1.expect)(last_name).to.equal('Elzanaty');
        }));
        it('should delete user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request
                .delete(`/api/users/${user.id}`)
                .set('Content-type', 'application/json')
                .set('Authorization', `Bearer ${token}`);
            (0, chai_1.expect)(res.status).to.equal(200);
            (0, chai_1.expect)(res.body.data.id).to.equal(user.id);
        }));
    });
});
