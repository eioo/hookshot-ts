import * as program from 'commander';
import * as fs from 'fs';
import * as path from 'path';

export function parseArguments() {
  program
    .version(
      JSON.parse(
        fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
      ).version
    )
    .usage('[options] <command>')
    .option('-p, --port <n>', 'Port number for webhook', 3000)
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
    program.help();
  }
  return {
    port: Number(program.port) || 3000,
    webhookPath: program.webhookPath,
    start: program.start,
    command: program.args.join(' '),
  };
}
