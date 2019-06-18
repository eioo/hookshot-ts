#!/usr/bin/env node
import { ChildProcess, SpawnOptions } from 'child_process';
import * as Fastify from 'fastify';
import * as formbody from 'fastify-formbody';

import { parseArguments } from './argParser';
import { logger } from './logger';
import { getCygwinPath, isCygwin, isWin, killProcess, runShellCommand } from './osUtils';

const args = parseArguments();
let currentProcess: ChildProcess;
let startTime: Date;
let endTime: Date;

async function createServer() {
  const fastify = Fastify();

  fastify.register(formbody);

  fastify.post(args.webhookPath, async () => {
    runAction();
    return '';
  });

  fastify.get(args.webhookPath, async () => {
    return 'heheh';
  });

  try {
    await fastify.listen(args.port, '0.0.0.0');
    logger.info(`Server listening on port ${args.port}`);
  } catch (err) {
    logger.error(`Server could not listen port ${args.port}:`, err);
    process.exit(1);
  }
}

function runAction() {
  let shell = process.env.SHELL;
  let cmdArgs = ['-c', args.command];
  const options: SpawnOptions = {
    stdio: 'inherit',
  };

  if (shell && isCygwin()) {
    shell = getCygwinPath(shell);
  } else if (isWin()) {
    shell = process.env.ComSpec;
    cmdArgs = ['/s', '/c', `"${args.command}"`];
    options.windowsVerbatimArguments = true;
  }

  if (shell) {
    if (currentProcess && !currentProcess.killed) {
      killProcess(currentProcess);
    }

    logger.info(`Running command: "${args.command}"`);
    currentProcess = runShellCommand(shell, cmdArgs, options);
    startTime = new Date();

    currentProcess.on('exit', () => {
      endTime = new Date();
      logger.info(`Done. Time elapsed: ${+endTime - +startTime}ms`);
    });
  } else {
    logger.error('Could not find valid shell to use.');
    process.exit(1);
  }
}

async function main() {
  await createServer();

  if (args.start) {
    runAction();
  }
}

main();
