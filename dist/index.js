"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
const PORT = config_1.default.port || 3000;
// create an instance server
const app = (0, express_1.default)();
// Middleware to parses incoming requests with JSON payloads and is based on body-parser.
app.use(express_1.default.json());
// HTTP request logger middleware
app.use((0, morgan_1.default)('common'));
// HTTP security middleware headers
app.use((0, helmet_1.default)());
// Basic rate-limiting middleware for Express
// Apply the rate limiting middleware to all requests
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'el3b b3ed ya ro7 mama',
}));
app.use('/api', routes_1.default);
// add routing for / path
app.get('/', (req, res) => {
    res.json({
        message: 'Hello World 🌍',
    });
});
// error handler middleware
app.use(error_middleware_1.default);
app.use((_, res) => {
    res.status(404).json({
        message: 'Ohh you are lost, read the API documentation to find your way back home 😂',
    });
});
// Check if the current file is the main module
if (require.main === module) {
    // start express server
    app.listen(PORT, () => {
        console.log(`Server is starting at port:${PORT}`);
    });
}
exports.default = app;
