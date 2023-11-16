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
const chai_1 = require("chai");
const user_model_1 = __importDefault(require("../user.model"));
const database_1 = __importDefault(require("../../database"));
const userModel = new user_model_1.default();
describe('Authentication Module', () => {
    let user = {
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
    describe('Test methods exists', () => {
        it('should have an Authenticate User method', () => {
            (0, chai_1.expect)(userModel.authenticate).to.be.a('function');
        });
    });
    describe('Test Authentication Logic', () => {
        it('Authenticate method should return the authenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            const authenticatedUser = yield userModel.authenticate(user.email, user.password);
            (0, chai_1.expect)(authenticatedUser).to.be.an('object');
            (0, chai_1.expect)(authenticatedUser === null || authenticatedUser === void 0 ? void 0 : authenticatedUser.email).to.equal(user.email);
            (0, chai_1.expect)(authenticatedUser === null || authenticatedUser === void 0 ? void 0 : authenticatedUser.user_name).to.equal(user.user_name);
            (0, chai_1.expect)(authenticatedUser === null || authenticatedUser === void 0 ? void 0 : authenticatedUser.first_name).to.equal(user.first_name);
            (0, chai_1.expect)(authenticatedUser === null || authenticatedUser === void 0 ? void 0 : authenticatedUser.last_name).to.equal(user.last_name);
        }));
        it('Authenticate method should return null for wrong credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const authenticatedUser = yield userModel.authenticate('mohammed@elzanaty.com', 'fake-password');
            (0, chai_1.expect)(authenticatedUser).to.be.null;
        }));
    });
});
