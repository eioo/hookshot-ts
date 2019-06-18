#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Fastify = require("fastify");
var formbody = require("fastify-formbody");
var argParser_1 = require("./argParser");
var logger_1 = require("./logger");
var osUtils_1 = require("./osUtils");
var args = argParser_1.parseArguments();
var currentProcess;
var startTime;
var endTime;
function createServer() {
    return __awaiter(this, void 0, void 0, function () {
        var fastify, err_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fastify = Fastify();
                    fastify.register(formbody);
                    fastify.post(args.webhookPath, function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            runAction();
                            return [2 /*return*/, ''];
                        });
                    }); });
                    fastify.get(args.webhookPath, function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, 'heheh'];
                        });
                    }); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fastify.listen(args.port, '0.0.0.0')];
                case 2:
                    _a.sent();
                    logger_1.logger.info("Server listening on port " + args.port);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    logger_1.logger.error("Server could not listen port " + args.port + ":", err_1);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function runAction() {
    var shell = process.env.SHELL;
    var cmdArgs = ['-c', args.command];
    var options = { stdio: 'inherit' };
    if (shell && osUtils_1.isCygwin()) {
        shell = osUtils_1.getCygwinPath(shell);
    }
    else if (osUtils_1.isWin()) {
        shell = process.env.ComSpec;
        cmdArgs = ['/s', '/c', "\"" + args.command + "\""];
        options.windowsVerbatimArguments = true;
    }
    if (shell) {
        if (currentProcess && !currentProcess.killed) {
            osUtils_1.killProcess(currentProcess);
        }
        logger_1.logger.info("Running command: \"" + args.command + "\"");
        currentProcess = osUtils_1.runShellCommand(shell, cmdArgs, options);
        startTime = new Date();
        currentProcess.on('close', function () {
            endTime = new Date();
            logger_1.logger.info("Done. Time elapsed: " + (+endTime - +startTime) + "ms");
        });
    }
    else {
        logger_1.logger.error('Could not find valid shell to use.');
        process.exit(1);
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createServer()];
                case 1:
                    _a.sent();
                    if (args.start) {
                        runAction();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main();
