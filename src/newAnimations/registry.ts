import type { AnimationRegistry } from 'src/types/newAnimations';

import { createAnimationFactory } from './factory';
import { AITeamTimeline } from './timelines/aiTeam';
import { AITeamHeroTimeline } from './timelines/aiTeamHero';
import { BlogCardTimeline } from './timelines/blogCard';
import { CardFadeTimeline } from './timelines/cardFade';
import { CardFlipTimeline } from './timelines/cardFlip';
import { ContentHeaderTimeline } from './timelines/contentHeader';
import { FooterTimeline } from './timelines/footer';
import { HeroTimeline } from './timelines/hero';
import { HomeHeroTimeline } from './timelines/homeHero';
import { IndustriesTimeline } from './timelines/industries';
import { LogosTimeline } from './timelines/logos';
import { ModernTimeline } from './timelines/modern';
import { PanelTimeline } from './timelines/panel';
import { RevealTimeline } from './timelines/reveal';

export const registry: AnimationRegistry = {
  aiTeam: createAnimationFactory(AITeamTimeline),
  aiTeamHero: createAnimationFactory(AITeamHeroTimeline),
  blogCard: createAnimationFactory(BlogCardTimeline),
  cardFade: createAnimationFactory(CardFadeTimeline),
  cardFlip: createAnimationFactory(CardFlipTimeline),
  contentHeader: createAnimationFactory(ContentHeaderTimeline),
  footer: createAnimationFactory(FooterTimeline),
  hero: createAnimationFactory(HeroTimeline),
  homeHero: createAnimationFactory(HomeHeroTimeline),
  industries: createAnimationFactory(IndustriesTimeline),
  logos: createAnimationFactory(LogosTimeline),
  modern: createAnimationFactory(ModernTimeline),
  panel: createAnimationFactory(PanelTimeline),
  reveal: createAnimationFactory(RevealTimeline),
};
