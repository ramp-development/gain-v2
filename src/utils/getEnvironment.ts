import type { Environment } from 'src/types';

export const getEnvironment = (): Environment => {
  const { host } = window.location;
  return host.includes('webflow.io') ? 'staging' : 'production';
};
