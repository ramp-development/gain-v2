import { aiTeamSlider } from './aiTeamSlider';
import { benefits } from './benefits';
import { nav } from './nav';
import { navigateBack } from './navigateBack';
import { team } from './team';
import { testimonials } from './testimonials';

export const components = () => {
  nav();
  benefits();
  team();
  aiTeamSlider();
  testimonials();
  navigateBack();
};
