/* eslint-disable no-console */
import { App } from '$app';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debug = (type: 'log' | 'warn' | 'error', message: any, data?: any) => {
  const app = App.getInstance();
  const { environment } = app;
  if (environment !== 'staging') return;

  console[type](message, data);
};
