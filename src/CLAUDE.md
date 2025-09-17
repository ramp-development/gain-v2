# Gain V2 Project Architecture

## Overview
This is a Webflow development project built with TypeScript, GSAP, and a custom event-driven architecture. The project uses the Finsweet developer starter template and implements smooth scrolling with Lenis.

## Core Architecture

### App Singleton (`app.ts`)
The central application controller that manages initialization and provides the EventBus for all components.

```typescript
import { App } from './app';
import { Events } from './types/events';

const app = App.getInstance();
app.init(); // Initializes Lenis and emits APP_INITIALIZED
```

**Key Features:**
- Singleton pattern ensures single instance
- Built-in EventBus for component communication
- Lenis smooth scroll integration with GSAP ScrollTrigger
- Initialization lifecycle management

### EventBus System
The EventBus (from `js-event-bus`) is the communication backbone of the application. All components communicate through events rather than direct coupling.

**Core Events (`types/events.ts`):**
- `APP_INITIALIZED` - Fired when App.init() completes
- `ANIMATION_STARTED` - Animation begins playing
- `ANIMATION_COMPLETED` - Animation finishes
- `ANIMATION_PAUSED` - Animation paused
- `ANIMATION_RESUMED` - Animation resumed
- `HERO_ANIMATION_COMPLETE` - Hero section animation done

**Usage Pattern:**
```typescript
// Emit events
app.eventBus.emit(Events.APP_INITIALIZED, { timestamp: Date.now() });

// Listen for events
app.eventBus.on(Events.APP_INITIALIZED, (data) => {
  // Initialize components
});

// One-time listener
app.eventBus.once(Events.HERO_ANIMATION_COMPLETE, () => {
  // Trigger follow-up action
});
```

## Project Structure

```
src/
├── CLAUDE.md              # This file - project architecture guide
├── app.ts                 # App singleton with EventBus
├── index.ts               # Main entry point
├── animations/            # GSAP animation system
│   ├── CLAUDE.md          # Animation system documentation
│   ├── manager.ts         # AnimationManager singleton
│   ├── factory.ts         # Timeline factory
│   └── ...                # Animation implementations
├── components/            # UI components
│   ├── index.ts
│   └── benefits.ts
├── config/                # Configuration
│   ├── index.ts
│   └── constants.ts
├── types/                 # TypeScript types
│   ├── index.ts
│   └── events.ts          # Event definitions
└── utils/                 # Utilities
    ├── queryElement.ts
    └── queryElements.ts
```

## Component Communication Flow

1. **Initialization Flow:**
   ```
   index.ts → App.init() → EventBus.emit(APP_INITIALIZED)
                         ↓
   Components listen for APP_INITIALIZED → Initialize themselves
   ```

2. **Animation Flow:**
   ```
   AnimationManager → EventBus.emit(ANIMATION_STARTED)
                   ↓
   Animation plays → EventBus.emit(ANIMATION_COMPLETED)
                   ↓
   Next animation or action triggered
   ```

3. **User Interaction Flow:**
   ```
   User action → Component → EventBus.emit(custom:event)
                          ↓
   Other components listen → React to event
   ```

## Development Workflow

### Available Scripts
- `pnpm run dev` - Start development with hot reload
- `pnpm run build` - Production build
- `pnpm run lint` - Run ESLint and Prettier checks
- `pnpm run check` - TypeScript type checking
- `pnpm run format` - Format code with Prettier

### Adding New Features

1. **New Component:**
   ```typescript
   // src/components/myComponent.ts
   import { App } from '../app';
   import { Events } from '../types/events';

   export class MyComponent {
     private app = App.getInstance();

     init() {
       this.app.eventBus.on(Events.APP_INITIALIZED, () => {
         this.setup();
       });
     }

     private setup() {
       // Component logic
     }
   }
   ```

2. **New Event:**
   ```typescript
   // src/types/events.ts
   export enum Events {
     // ... existing events
     MY_CUSTOM_EVENT = 'custom:my-event',
   }
   ```

3. **New Animation:**
   - See `src/animations/CLAUDE.md` for animation system details
   - Animations integrate with EventBus for coordination

## Best Practices

1. **Always Use EventBus:**
   - Components should communicate via EventBus, not direct references
   - This maintains loose coupling and testability

2. **Singleton Pattern:**
   - App and AnimationManager use singleton pattern
   - Access via `getInstance()` method

3. **TypeScript First:**
   - Define types for all data structures
   - Use enums for event names to prevent typos

4. **Event Naming Convention:**
   - System events: `CONSTANT_CASE`
   - Module events: `module:action` (e.g., `animation:started`)
   - Custom events: `custom:description`

5. **Initialization Order:**
   - App.init() must be called first
   - Components initialize on APP_INITIALIZED event
   - Animations scan DOM after components ready

## Integration with Webflow

The project is designed to work with Webflow's exported code:
- Elements use data attributes for behavior
- Animations triggered by data-animation attributes
- Components enhance existing Webflow elements
- EventBus coordinates complex interactions

## Dependencies

### Core Libraries
- `gsap` - Animation engine
- `lenis` - Smooth scroll
- `js-event-bus` - Event system
- `@finsweet/ts-utils` - TypeScript utilities

### Development
- TypeScript 5.7+
- ESBuild for bundling
- ESLint + Prettier for code quality
- Playwright for testing

## Debugging Tips

1. **Event Monitoring:**
   ```typescript
   // Debug all events
   app.eventBus.on('*', (event, data) => {
     console.log('Event:', event, data);
   });
   ```

2. **Component State:**
   - Add debug logging in development
   - Use browser DevTools for GSAP debugging

3. **Performance:**
   - Monitor ScrollTrigger instances
   - Check EventBus listener count
   - Profile animation performance