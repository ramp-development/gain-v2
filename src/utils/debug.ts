/* eslint-disable no-console */
import { App } from '$app';

export const debug = (type: 'log' | 'warn' | 'error', message: string, data: unknown) => {
  const app = App.getInstance();
  const { environment } = app;
  if (environment !== 'staging') return;

  console[type](message, data);
};
