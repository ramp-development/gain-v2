import { initAnimations } from './animations';
import { App } from './app';
import { components } from './components';

window.Webflow ||= [];
window.Webflow.push(() => {
  // Initialize animation system (sets up listeners for APP_INITIALIZED)
  initAnimations();

  // Initialize components
  components();

  // Initialize the app singleton
  const app = App.getInstance();

  // Initialize app (this will trigger APP_INITIALIZED when ready)
  app.init();
});
