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
describe('User Model', () => {
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
        it('should have a Get Many Users method', () => {
            (0, chai_1.expect)(userModel.getMany).to.be.a('function');
        });
        it('should have a Get One User method', () => {
            (0, chai_1.expect)(userModel.getOne).to.be.a('function');
        });
        it('should have a Create User method', () => {
            (0, chai_1.expect)(userModel.create).to.be.a('function');
        });
        it('should have an Update User method', () => {
            (0, chai_1.expect)(userModel.updateOne).to.be.a('function');
        });
        it('should have a Delete User method', () => {
            (0, chai_1.expect)(userModel.deleteOne).to.be.a('function');
        });
        it('should have an Authenticate User method', () => {
            (0, chai_1.expect)(userModel.authenticate).to.be.a('function');
        });
    });
    describe('Test User Model Logic', () => {
        it('Create method should return a New User', () => __awaiter(void 0, void 0, void 0, function* () {
            const createdUser = yield userModel.create({
                email: 'test2@test.com',
                user_name: 'test2User',
                first_name: 'Test',
                last_name: 'User',
                password: 'test123',
            });
            (0, chai_1.expect)(createdUser).to.include({
                email: 'test2@test.com',
                user_name: 'test2User',
                first_name: 'Test',
                last_name: 'User',
            });
        }));
        it('Get Many method should return All available users in DB', () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield userModel.getMany();
            (0, chai_1.expect)(users).to.be.an('array');
            (0, chai_1.expect)(users).to.have.lengthOf.at.least(2);
        }));
        it('Get One method should return testUser when called with ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const returnedUser = yield userModel.getOne(user.id);
            (0, chai_1.expect)(returnedUser).to.include({
                id: user.id,
                email: user.email,
                user_name: user.user_name,
                first_name: user.first_name,
                last_name: user.last_name,
            });
        }));
        it('Update One method should return a user with edited attributes', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedUser = yield userModel.updateOne(Object.assign(Object.assign({}, user), { user_name: 'testUser Updated', first_name: 'Mohammed', last_name: 'Elzanaty' }));
            (0, chai_1.expect)(updatedUser).to.include({
                id: user.id,
                email: user.email,
                user_name: 'testUser Updated',
                first_name: 'Mohammed',
                last_name: 'Elzanaty',
            });
        }));
        it('Delete One method should delete user from DB', () => __awaiter(void 0, void 0, void 0, function* () {
            const deletedUser = yield userModel.deleteOne(user.id);
            (0, chai_1.expect)(deletedUser).to.include({ id: user.id });
        }));
    });
});
