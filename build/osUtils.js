"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var childProcess = require("child_process");
var fs = require("fs");
var path = require("path");
var kill = require("tree-kill");
var logger_1 = require("./logger");
function runShellCommand(shell, args, options) {
    return childProcess.spawn(shell, args, options);
}
exports.runShellCommand = runShellCommand;
function killProcess(process) {
    kill(process.pid);
}
exports.killProcess = killProcess;
function isWin() {
    return 'win32' === process.platform;
}
exports.isWin = isWin;
function isCygwin() {
    return isWin() && /cygwin/i.test(process.env.HOME || '');
}
exports.isCygwin = isCygwin;
function getCygwinPath(shellPath) {
    var cygwinPaths = ['C:\\cygwin', 'C:\\cygwin64'];
    for (var _i = 0, cygwinPaths_1 = cygwinPaths; _i < cygwinPaths_1.length; _i++) {
        var pathToTest = cygwinPaths_1[_i];
        var fullPath = path.normalize(pathToTest + shellPath + '.exe');
        if (fs.existsSync(fullPath)) {
            return fullPath;
        }
    }
    logger_1.logger.error('Could not find Cygwin directory');
    return process.exit(1);
}
exports.getCygwinPath = getCygwinPath;
