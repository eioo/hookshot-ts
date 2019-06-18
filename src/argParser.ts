import * as program from 'commander';
import * as fs from 'fs';
import * as path from 'path';

import { logger } from './logger';

export function parseArguments() {
  program
    .version(
      JSON.parse(
        fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
      ).version
    )
    .usage('[options] <command>')
    .option('-p, --port <n>', 'Port number for webhook', parseInt, 3000)
    .option('-w, --webhookPath <path>', 'Path for webhook', '/')
    .option('-s, --start', 'Run command on start');

  program.on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log(`  $ hookshot 'echo "pushed to master!"'`);
    console.log(
      `  $ hookshot -s -p 9001 'git pull origin master && npm install && npm start'`
    );
  });

  program.parse(process.argv);

  if (!program.args.length) {
    logger.error('Please supply a command to run');
    process.exit(1);
  }

  return {
    port: program.port,
    webhookPath: program.webhookPath,
    start: program.start,
    command: program.args.join(' '),
  };
}
