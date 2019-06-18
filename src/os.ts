import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as kill from 'tree-kill';

import { logger } from './logger';

export function runShellCommand(
  shell: string,
  args: string[],
  options: childProcess.SpawnOptions
) {
  return childProcess.spawn(shell, args, options);
}

export function killProcess(process: childProcess.ChildProcess) {
  kill(process.pid);
}

export function isWin() {
  return 'win32' === process.platform;
}

export function isCygwin() {
  return isWin() && /cygwin/i.test(process.env.HOME || '');
}

export function getCygwinPath(shellPath: string) {
  const cygwinPaths = ['C:\\cygwin', 'C:\\cygwin64'];

  for (const pathToTest of cygwinPaths) {
    const fullPath = path.normalize(pathToTest + shellPath + '.exe');

    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  logger.error('Could not find Cygwin directory');
  return process.exit(1);
}
