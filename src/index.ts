// import { initAnimations } from './animations';
import { App } from './app';
import { components } from './components';
import { animations } from './newAnimations';

window.Webflow ||= [];
window.Webflow.push(() => {
  components();
  animations();

  const app = App.getInstance();
  app.init();
});
