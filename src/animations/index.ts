import { App } from '$app';
import { Events } from '$events';

import { defaults } from './defaults';
import { AnimationManager } from './manager';

export const animations = () => {
  const app = App.getInstance();
  defaults(app.debug);

  const manager = new AnimationManager();

  // Set up animation manager after app initialization
  app.eventBus.on(Events.APP_INITIALIZED, () => {
    manager.init();
  });
};
