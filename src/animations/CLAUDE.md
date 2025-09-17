# GSAP Animation System

## Overview
This module provides a comprehensive GSAP animation system that integrates with the App EventBus for coordinated animations. The system handles multiple instances of animations, dynamic sequencing, and various trigger types while maintaining ScrollTrigger autonomy.

## Architecture

### Core Components

1. **AnimationManager (Singleton)**
   - Central controller tracking all animation instances
   - Handles post-hero trigger checking and catch-up
   - Manages sequential playback for same-type animations
   - Integrates with App.eventBus for coordination

2. **Timeline Registry**
   - Stores timeline creators and their trigger configurations
   - Each timeline defines its own ScrollTrigger settings
   - Supports both entrance and scrub animations

3. **Trigger System**
   - **entrance** - Plays animation when element enters viewport
   - **scrub** - Animation progress tied to scroll position
   - **load** - Plays on page load if visible
   - **event** - Triggered via EventBus events
   - **sequence** - Manually triggered in sequence

4. **Instance Management**
   - Tracks all animation instances individually
   - Handles multiple instances of same animation type
   - Maintains state per instance (pending/playing/completed)
   - Sequential execution for same-type animations

## Webflow Integration

### Data Attributes
Elements in Webflow use these streamlined data attributes:

```html
<!-- Hero animation (load trigger) -->
<div data-animation="hero" data-trigger="load"></div>

<!-- Entrance animation (plays when scrolled into view) -->
<div data-animation="modern" data-trigger="entrance"></div>

<!-- Scrub animation (progress tied to scroll) -->
<div data-animation="panels" data-trigger="scrub"></div>

<!-- Multiple instances of same animation -->
<div data-animation="modern" data-trigger="entrance"></div>
<div data-animation="modern" data-trigger="entrance"></div>
<!-- These will play sequentially if triggered together -->

<!-- Event-triggered animation -->
<div data-animation="modal" data-trigger="event"></div>

<!-- Override event name if needed -->
<div data-animation="sidebar" data-trigger="event" data-event="menu:open"></div>
```

### Trigger Types

1. **`entrance`** - Plays once when element scrolls into view
   - Uses ScrollTrigger with `toggleActions: 'play none none none'`
   - Each timeline defines its start/end points

2. **`scrub`** - Animation progress tied to scroll position
   - Uses ScrollTrigger with `scrub: true` or numeric value
   - Perfect for parallax and scroll-driven effects

3. **`load`** - Plays on page load if element is visible
   - Checks viewport visibility before playing
   - Typically used for hero animations

4. **`event`** - Triggered via EventBus
   - Defaults to animation name as event name
   - Can override with `data-event` attribute

5. **`sequence`** - Manually triggered by animation system
   - Used for post-hero catch-up scenarios

### Additional Options

- `data-trigger-options`: JSON object with trigger-specific configuration
- `data-animation-options`: JSON object with animation-specific parameters
- `data-animation-id`: Unique identifier for programmatic control

## Implementation Guide

### 1. Animation Manager Setup
The AnimationManager is initialized automatically on page load and:
- Scans for all elements with `data-animation`
- Registers appropriate triggers
- Manages timeline lifecycle

### 2. Creating New Animations
Add new animations to the timeline factory:

```typescript
// src/animations/timelines/myAnimation.ts
export const myAnimation = (element: HTMLElement, options = {}) => {
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(element,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, ...options }
  );

  return tl;
};
```

### 3. Visibility Detection
The system automatically checks visibility for load-triggered animations:
- Uses Intersection Observer for performance
- Considers viewport position on page load
- Handles dynamic content loading

### 4. Timeline Configuration

Each timeline exports its animation and ScrollTrigger configuration:

```typescript
// animations/timelines/modern.ts
export const modernTimeline = (element: HTMLElement) => {
  const tl = gsap.timeline({ paused: true });
  tl.from(element, { opacity: 0, y: 50, duration: 1 });
  return tl;
};

export const modernConfig = {
  start: 'top 80%',       // When top hits 80% down viewport
  end: 'bottom top',      // Standard end point
  toggleActions: 'play none none none',
};

// animations/timelines/panels.ts
export const panelsTimeline = (element: HTMLElement) => {
  const tl = gsap.timeline({ paused: true });
  // Scrubbed animation
  tl.to('.panel-1', { x: -100 })
    .to('.panel-2', { x: 100 }, '<')
    .to('.panel-3', { scale: 1.2 });
  return tl;
};

export const panelsConfig = {
  start: 'top bottom',
  end: 'bottom top',
  scrub: 1,  // Smooth scrubbing
};
```

### 5. Post-Hero Sequencing

```typescript
// On page load:
1. APP_INITIALIZED fires
2. AnimationManager scans DOM and creates all animations
3. Sets up ScrollTriggers (they work autonomously)
4. Hero plays if visible

// After hero completes:
1. Find ALL animations after hero in DOM
2. For each animation:
   - Check if ScrollTrigger already passed
   - If yes: play manually (sequentially by type)
   - If no: let ScrollTrigger handle it

// Multiple instances:
- Same-type animations play sequentially
- Different types can play simultaneously
- State tracked per instance
```

## File Structure

```
animations/
├── index.ts           # Main entry, initializes AnimationManager
├── manager.ts         # AnimationManager singleton
├── config.ts          # GSAP global defaults
├── factory.ts         # Creates animations from registry
├── registry.ts        # Timeline registry with configs
├── triggers/          # Trigger implementations
│   ├── index.ts
│   ├── entrance.ts    # ScrollTrigger entrance animations
│   ├── scrub.ts       # ScrollTrigger scrub animations
│   ├── load.ts        # Load trigger with visibility
│   └── event.ts       # EventBus triggers
├── timelines/         # Animation definitions
│   ├── index.ts       # Exports all timelines
│   ├── hero.ts        # Hero animation + config
│   ├── modern.ts      # Modern animation + config
│   ├── panels.ts      # Panels scrub animation + config
│   └── [others].ts    # Other animations
└── utils/
    ├── visibility.ts  # Viewport visibility checks
    └── dom.ts         # DOM position helpers
```

## Best Practices

1. **Performance**
   - Use `will-change` sparingly
   - Batch DOM reads/writes
   - Leverage GSAP's built-in optimization

2. **Reusability**
   - Create parameterized timelines
   - Use consistent naming conventions
   - Document animation options

3. **Debugging**
   - Enable GSAP DevTools in development
   - Use animation IDs for tracking
   - Log trigger events in debug mode

## Common Patterns

### Hero Animation (Visible on Load)
```html
<section data-animation="hero" data-trigger="load">
  <!-- Hero content -->
</section>
```

### Staggered List Animation
```html
<ul data-animation="staggerList" data-trigger="scroll">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

### Parallax Section
```html
<div data-animation="parallax" data-trigger="scroll"
     data-trigger-options='{"scrub": true}'>
  <!-- Parallax content -->
</div>
```

### Sequential Reveal
```html
<div data-animation="sequentialReveal" data-trigger="custom"
     data-trigger-event="start-sequence">
  <!-- Sequential content -->
</div>
```

## Testing

Run the following commands:
- `pnpm run dev` - Development build with hot reload
- `pnpm run build` - Production build
- `pnpm run check` - TypeScript type checking
- `pnpm run lint` - Linting and formatting checks

## Troubleshooting

### Animation Not Playing
1. Check element has correct data attributes
2. Verify animation is registered in factory
3. Check browser console for errors
4. Ensure GSAP and plugins are loaded

### Performance Issues
1. Reduce number of ScrollTriggers
2. Use `batch` for multiple similar animations
3. Optimize animation complexity
4. Check for memory leaks in timeline cleanup

### Visibility Detection Issues
1. Verify threshold settings
2. Check element positioning
3. Test with different viewport sizes
4. Review Intersection Observer support

## Implementation Progress

### ✅ Completed
1. **GSAP Configuration** (`config.ts`)
   - Global defaults set
   - Environment-based markers
   - Common trigger configurations

2. **TypeScript Types** (`types/animations.ts`)
   - Full type definitions for the system
   - Animation instance tracking
   - Event data structures

3. **AnimationManager** (`manager.ts`)
   - Singleton pattern implemented
   - DOM scanning and instance creation
   - Post-hero sequencing logic
   - Uses GSAP's built-in ScrollTrigger methods
   - EventBus integration

4. **Utilities**
   - `utils/scroll.ts` - GSAP ScrollTrigger helpers
   - `utils/dom.ts` - DOM traversal and element queries

5. **AnimationFactory** (`factory.ts`)
   - Creates timelines from registry
   - Applies configuration based on type

### ✅ All Core Components Complete!

6. **Timeline Registry** (`registry.ts`)
   - Central registry for all animations
   - Maps names to timeline definitions
   - Exports helper functions

7. **Example Animations**
   - `timelines/hero.ts` - Hero section with staggered reveals
   - `timelines/modern.ts` - Entrance animation for sections
   - `timelines/panels.ts` - Scrubbed panel animations

8. **Main Entry Point** (`index.ts`)
   - Initializes animation system
   - Hooks into APP_INITIALIZED event
   - Exports key components

## Usage in Webflow

### HTML Structure
```html
<!-- Hero section -->
<section data-animation="hero" data-trigger="load">
  <h1>Welcome</h1>
  <p>Hero content</p>
  <a href="#" class="button">Get Started</a>
</section>

<!-- Modern section (multiple instances) -->
<div data-animation="modern" data-trigger="entrance">
  <h2>Feature 1</h2>
  <p>Description</p>
</div>

<div data-animation="modern" data-trigger="entrance">
  <h2>Feature 2</h2>
  <p>Description</p>
</div>

<!-- Panels with scrub -->
<div data-animation="panels" data-trigger="scrub">
  <div class="panel">Panel 1</div>
  <div class="panel">Panel 2</div>
  <div class="panel">Panel 3</div>
</div>
```

### Adding New Animations

1. Create timeline file in `timelines/`:
```typescript
// timelines/myAnimation.ts
export const myAnimationTimeline: TimelineCreator = (element, context) => {
  const tl = gsap.timeline({ paused: true });
  // Build your animation
  return tl;
};

export const myAnimationTriggerConfig: ScrollTriggerConfig = {
  start: 'top 75%',
  toggleActions: 'play none none none',
};
```

2. Add to registry:
```typescript
// registry.ts
import { myAnimationTimeline, myAnimationTriggerConfig } from './timelines/myAnimation';

export const timelineRegistry = {
  // ... existing animations
  myAnimation: {
    create: myAnimationTimeline,
    triggerConfig: myAnimationTriggerConfig,
    defaultTrigger: 'entrance',
  },
};
```

3. Use in Webflow:
```html
<div data-animation="myAnimation" data-trigger="entrance"></div>
```

## System Flow

### Initialization Flow
```
1. Webflow.push() executes
2. App.init() called
3. initAnimations() sets up listeners
4. APP_INITIALIZED fires
5. AnimationManager.initialize() runs
6. DOM scanned for [data-animation]
7. Timelines created (paused)
8. ScrollTriggers set up
9. Hero plays if visible
10. Post-hero sequencing ready
```

### Animation Execution Flow
```
Hero visible? → Play hero
↓
Hero completes → Emit animation:hero:complete
↓
Check animations after hero in DOM
↓
For each animation:
  - ScrollTrigger.progress > 0? → Play manually
  - Otherwise → Let ScrollTrigger handle
↓
Same-type animations play sequentially
Different types can play simultaneously
```

## Implementation Example

### Complete AnimationManager Usage
```typescript
class AnimationManager {
  private instances: AnimationInstance[] = [];

  initialize() {
    // Scan DOM for all data-animation elements
    this.scanAndCreateAnimations();

    // Play hero if visible
    this.playHeroIfVisible();

    // Set up post-hero sequencing
    this.setupPostHeroSequence();
  }

  private setupPostHeroSequence() {
    app.eventBus.on('animation:hero:complete', () => {
      const heroElement = this.getHeroElement();
      if (!heroElement) return;

      // Find animations after hero
      const afterHero = this.instances.filter(instance => {
        return this.isAfterInDOM(heroElement, instance.element) &&
               instance.state === 'pending' &&
               (instance.trigger === 'entrance' || instance.trigger === 'scrub');
      });

      // Check each for trigger conditions
      afterHero.forEach(instance => {
        if (this.hasScrollTriggerPassed(instance)) {
          this.playSequentially(instance);
        }
        // Else ScrollTrigger handles it
      });
    });
  }
}
```

### GSAP Configuration
```typescript
// animations/config.ts
export const initGSAPDefaults = () => {
  gsap.defaults({
    duration: 1,
    ease: 'power2.inOut',
  });

  ScrollTrigger.defaults({
    markers: false,  // Enable in dev
  });
};
```

### Usage
```typescript
// src/index.ts (already configured)
import { initAnimations } from './animations';
import { App } from './app';

window.Webflow.push(() => {
  const app = App.getInstance();
  app.init();
  initAnimations(); // Sets everything up
});
```

## Key Features Implemented

✅ **Multiple Instance Handling** - Same animations play sequentially
✅ **GSAP Built-in Methods** - Uses ScrollTrigger.progress, isInViewport
✅ **Automatic ScrollTriggers** - Set up once, work autonomously
✅ **Post-Hero Catch-up** - Plays missed animations after hero
✅ **EventBus Integration** - Full event system coordination
✅ **Timeline-Specific Configs** - Each animation defines its triggers
✅ **Entrance vs Scrub** - Different behaviors for different needs
✅ **Context Support** - Pass data via attributes