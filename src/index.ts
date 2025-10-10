import { animations } from './animations';
import { App } from './app';
import { components } from './components';

window.Webflow ||= [];
window.Webflow.push(() => {
  components();
  animations();

  const app = App.getInstance();
  app.init();
});
