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
        // ... (other tests remain the same, just replace `toBe` with `to.equal` and other Jasmine assertions with Chai assertions)
    });
});
