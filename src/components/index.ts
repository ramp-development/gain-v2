import { aiTeamSlider } from './aiTeamSlider';
import { appendAnchor } from './appendAnchor';
import { benefits } from './benefits';
import { nav } from './nav';
import { team } from './team';
import { testimonials } from './testimonials';

export const components = () => {
  nav();
  benefits();
  team();
  aiTeamSlider();
  testimonials();
  appendAnchor();
};
