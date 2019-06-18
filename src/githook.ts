import { ChildProcess, SpawnOptions } from 'child_process';
import { EventEmitter } from 'events';
import * as Fastify from 'fastify';
import * as formbody from 'fastify-formbody';

import { logger } from './logger';
import { getCygwinPath, isCygwin, isWin, killProcess, runShellCommand } from './osUtils';
import { IGitHookOptions } from './types';

export default class GitHook extends EventEmitter {
  private process: ChildProcess;
  private startTime: number;
  private endTime: number;

  constructor(public options: IGitHookOptions) {
    super();
    this.start();
  }

  public runCommand() {
    let shell = process.env.SHELL;
    let cmdArgs = ['-c', this.options.command];
    const options: SpawnOptions = {
      stdio: 'inherit',
    };

    if (shell && isCygwin()) {
      shell = getCygwinPath(shell);
    } else if (isWin()) {
      shell = process.env.ComSpec;
      cmdArgs = ['/s', '/c', `"${this.options.command}"`];
      options.windowsVerbatimArguments = true;
    }

    if (shell) {
      if (this.process && !this.process.killed) {
        killProcess(this.process);
        this.emit('exit');
      }

      this.process = runShellCommand(shell, cmdArgs, options);
      this.emit('spawn');
    } else {
      logger.error('Could not find valid shell to use.');
      process.exit(1);
    }
  }

  private async start() {
    this.setupEvents();
    await this.createServer();

    if (this.options.start) {
      this.runCommand();
    }
  }

  private setupEvents() {
    this.on('spawn', () => {
      this.startTime = +new Date();
      logger.info(`Running command:\n"${this.options.command}"`);
    });

    this.on('exit', () => {
      this.endTime = +new Date();
      const deltaSec = (this.endTime - this.startTime) / 1000;
      logger.info(`Exited. Time it run: ${deltaSec}s`);
    });
  }

  private async createServer() {
    const port = this.options.port || 3000;
    const webhookPath = this.options.webhookPath || '/';
    const fastify = Fastify();

    fastify.register(formbody);

    fastify.post(webhookPath, async () => {
      this.runCommand();
      return 'Accept';
    });

    try {
      await fastify.listen(port, '0.0.0.0');
      logger.info(`Server listening on port ${port}`);
    } catch (err) {
      logger.error(`Server could not listen port ${port}:`, err);
      process.exit(1);
    }
  }
}
