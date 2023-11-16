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
const user_model_1 = __importDefault(require("../user.model"));
const database_1 = __importDefault(require("../../database"));
const userModel = new user_model_1.default();
describe('User Model', () => {
    describe('Test methods exists', () => {
        it('should have an Get Many Users method', () => {
            expect(userModel.getMany).toBeDefined();
        });
        it('should have a Get One User method', () => {
            expect(userModel.getOne).toBeDefined();
        });
        it('should have a Create User method', () => {
            expect(userModel.create).toBeDefined();
        });
        it('should have a Update User method', () => {
            expect(userModel.updateOne).toBeDefined();
        });
        it('should have a Delete User method', () => {
            expect(userModel.deleteOne).toBeDefined();
        });
        it('should have an Authenticate User method', () => {
            expect(userModel.authenticate).toBeDefined();
        });
    });
    describe('Test User Model Logic', () => {
        const user = {
            email: 'test@test.com',
            user_name: 'testUser',
            first_name: 'Test',
            last_name: 'User',
            password: 'test123',
        };
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const createdUser = yield userModel.create(user);
            user.id = createdUser.id;
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const connection = yield database_1.default.connect();
            // if you are not using uuid u need to add `\nALTER SEQUENCE users_id_seq RESTART WITH 1;`
            const sql = 'DELETE FROM users;';
            yield connection.query(sql);
            connection.release();
        }));
        it('Create method should return a New User', () => __awaiter(void 0, void 0, void 0, function* () {
            const createdUser = yield userModel.create({
                email: 'test2@test.com',
                user_name: 'test2User',
                first_name: 'Test',
                last_name: 'User',
                password: 'test123',
            });
            expect(createdUser).toEqual({
                id: createdUser.id,
                email: 'test2@test.com',
                user_name: 'test2User',
                first_name: 'Test',
                last_name: 'User',
            });
        }));
        it('Get Many method should return All available users in DB', () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield userModel.getMany();
            expect(users.length).toBe(2);
        }));
        it('Get One method should return testUser when called with ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const returnedUser = yield userModel.getOne(user.id);
            expect(returnedUser.id).toBe(user.id);
            expect(returnedUser.email).toBe(user.email);
            expect(returnedUser.user_name).toBe(user.user_name);
            expect(returnedUser.first_name).toBe(user.first_name);
            expect(returnedUser.last_name).toBe(user.last_name);
        }));
        it('Update One method should return a user with edited attributes', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedUser = yield userModel.updateOne(Object.assign(Object.assign({}, user), { user_name: 'testUser Updated', first_name: 'Mohammed', last_name: 'Elzanaty' }));
            expect(updatedUser.id).toBe(user.id);
            expect(updatedUser.email).toBe(user.email);
            expect(updatedUser.user_name).toBe('testUser Updated');
            expect(updatedUser.first_name).toBe('Mohammed');
            expect(updatedUser.last_name).toBe('Elzanaty');
        }));
        it('Delete One method should delete user from DB', () => __awaiter(void 0, void 0, void 0, function* () {
            const deletedUser = yield userModel.deleteOne(user.id);
            expect(deletedUser.id).toBe(user.id);
        }));
    });
});
