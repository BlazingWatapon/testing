"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://www.npmjs.com/package/jasmine-spec-reporter
const jasmine_spec_reporter_1 = require("jasmine-spec-reporter");
class CustomProcessor extends jasmine_spec_reporter_1.DisplayProcessor {
    displayJasmineStarted(info, log) {
        return `TypeScript ${log}`;
    }
}
jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new jasmine_spec_reporter_1.SpecReporter({
    spec: {
        displayStacktrace: jasmine_spec_reporter_1.StacktraceOption.NONE,
    },
    customProcessors: [CustomProcessor],
}));
