export interface IGitHookOptions {
  command: string;
  webhookPath?: string;
  port?: number;
  start?: boolean;
}
