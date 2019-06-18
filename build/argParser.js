"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var fs = require("fs");
var path = require("path");
function parseArguments() {
    program
        .version(JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')).version)
        .alias('d')
        .usage('[options] <command>')
        .option('-p, --port <n>', 'Port number for webhook', parseInt, 3000)
        .option('-w, --webhookPath <path>', 'Path for webhook', '/')
        .option('-s, --start', 'Run command on start');
    program.on('--help', function () {
        console.log('');
        console.log('Examples:');
        console.log("  $ hookshot 'echo \"pushed to master!\"'");
        console.log("  $ hookshot -s -p 9001 'git pull origin master && npm install && npm start'");
    });
    program.parse(process.argv);
    return {
        port: program.port,
        webhookPath: program.webhookPath,
        start: program.start,
        command: program.args.join(' '),
    };
}
exports.parseArguments = parseArguments;
