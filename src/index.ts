#!/usr/bin/env node
import { ChildProcess, SpawnOptions } from 'child_process';
import * as Fastify from 'fastify';
import * as formbody from 'fastify-formbody';

import { parseArguments } from './argParser';
import { logger } from './logger';
import { getCygwinPath, isCygwin, isWin, runShellCommand } from './osUtils';

const args = parseArguments();
let currentProcess: ChildProcess;
let startTime: Date;
let endTime: Date;

async function createServer(port: number, path = '/') {
  const fastify = Fastify();

  fastify.register(formbody);

  fastify.post(path, async () => {
    runAction();
    return '';
  });

  try {
    await fastify.listen(port);
    logger.info(`Server listening on port ${port}`);
  } catch (err) {
    logger.error(`Server could not listen port ${port}:`, err);
    process.exit(1);
  }
}

function runAction() {
  let shell = process.env.SHELL;
  let cmdArgs = ['-c'];
  const options: SpawnOptions = { stdio: 'inherit' };

  if (shell && isCygwin()) {
    shell = getCygwinPath(shell);
  } else if (isWin()) {
    shell = process.env.ComSpec;
    cmdArgs = ['/s', '/c', `"${args.command}"`];
    options.windowsVerbatimArguments = true;
  }

  if (shell) {
    if (currentProcess && !currentProcess.killed) {
      currentProcess.kill();
    }

    logger.info(`Running command: "${args.command}"`);
    startTime = new Date();
    currentProcess = runShellCommand(shell, cmdArgs, options);

    currentProcess.on('close', () => {
      endTime = new Date();
      logger.info(`Done. Time elapsed: ${+endTime - +startTime}ms`);
    });
  } else {
    logger.error('Could not find valid shell to use.');
    process.exit(1);
  }
}

async function main() {
  await createServer(8080);
}

main();
