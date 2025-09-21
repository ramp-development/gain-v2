"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // bin/live-reload.js
  var init_live_reload = __esm({
    "bin/live-reload.js"() {
      "use strict";
      new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());
    }
  });

  // node_modules/.pnpm/js-event-bus@1.1.1/node_modules/js-event-bus/src/index.js
  var require_src = __commonJS({
    "node_modules/.pnpm/js-event-bus@1.1.1/node_modules/js-event-bus/src/index.js"(exports, module) {
      init_live_reload();
      (function(caller, bus) {
        if (typeof exports === "object" && typeof module === "object") {
          module.exports = bus();
          module.exports.default = module.exports;
        } else if (typeof exports === "object") {
          exports.EventBus = bus();
        } else {
          caller.EventBus = bus();
        }
      })(exports, function() {
        var EventBus2 = function() {
          this.listeners = {};
          this.registerListener = function(event, callback, number) {
            var type = event.constructor.name;
            number = this.validateNumber(number || "any");
            if (type !== "Array") {
              event = [event];
            }
            event.forEach(function(e) {
              if (e.constructor.name !== "String") {
                throw new Error(
                  "Only `String` and array of `String` are accepted for the event names!"
                );
              }
              that.listeners[e] = that.listeners[e] || [];
              that.listeners[e].push({
                callback,
                number
              });
            });
          };
          this.validateNumber = function(n) {
            var type = n.constructor.name;
            if (type === "Number") {
              return n;
            } else if (type === "String" && n.toLowerCase() === "any") {
              return "any";
            }
            throw new Error(
              "Only `Number` and `any` are accepted in the number of possible executions!"
            );
          };
          this.toBeRemoved = function(info) {
            var number = info.number;
            info.execution = info.execution || 0;
            info.execution++;
            if (number === "any" || info.execution < number) {
              return false;
            }
            return true;
          };
          var that = this;
          return {
            /**
             * Attach a callback to an event
             * @param {string} eventName - name of the event.
             * @param {function} callback - callback executed when this event is triggered
             */
            on: function(eventName, callback) {
              that.registerListener.bind(that)(eventName, callback, "any");
            },
            /**
             * Attach a callback to an event. This callback will not be executed more than once if the event is trigger mutiple times
             * @param {string} eventName - name of the event.
             * @param {function} callback - callback executed when this event is triggered
             */
            once: function(eventName, callback) {
              that.registerListener.bind(that)(eventName, callback, 1);
            },
            /**
             * Attach a callback to an event. This callback will be executed will not be executed more than the number if the event is trigger mutiple times
             * @param {number} number - max number of executions
             * @param {string} eventName - name of the event.
             * @param {function} callback - callback executed when this event is triggered
             */
            exactly: function(number, eventName, callback) {
              that.registerListener.bind(that)(eventName, callback, number);
            },
            /**
             * Kill an event with all it's callbacks
             * @param {string} eventName - name of the event.
             */
            die: function(eventName) {
              delete that.listeners[eventName];
            },
            /**
             * Kill an event with all it's callbacks
             * @param {string} eventName - name of the event.
             */
            off: function(eventName) {
              this.die(eventName);
            },
            /**
             * Remove the callback for the given event
             * @param {string} eventName - name of the event.
             * @param {callback} callback - the callback to remove (undefined to remove all of them).
             */
            detach: function(eventName, callback) {
              if (callback === void 0) {
                that.listeners[eventName] = [];
                return true;
              }
              for (var k in that.listeners[eventName]) {
                if (that.listeners[eventName].hasOwnProperty(k) && that.listeners[eventName][k].callback === callback) {
                  that.listeners[eventName].splice(k, 1);
                  return this.detach(eventName, callback);
                }
              }
              return true;
            },
            /**
             * Remove all the events
             */
            detachAll: function() {
              for (var eventName in that.listeners) {
                if (that.listeners.hasOwnProperty(eventName)) {
                  this.detach(eventName);
                }
              }
            },
            /**
             * Emit the event
             * @param {string} eventName - name of the event.
             */
            emit: function(eventName, context) {
              var listeners = [];
              for (var name in that.listeners) {
                if (that.listeners.hasOwnProperty(name)) {
                  if (name === eventName) {
                    Array.prototype.push.apply(listeners, that.listeners[name]);
                  }
                  if (name.indexOf("*") >= 0) {
                    var newName = name.replace(/\*\*/, "([^.]+.?)+");
                    newName = newName.replace(/\*/g, "[^.]+");
                    var match = eventName.match(newName);
                    if (match && eventName === match[0]) {
                      Array.prototype.push.apply(listeners, that.listeners[name]);
                    }
                  }
                }
              }
              var parentArgs = arguments;
              context = context || this;
              listeners.forEach(function(info, index) {
                var callback = info.callback;
                var number = info.number;
                if (context) {
                  callback = callback.bind(context);
                }
                var args = [];
                Object.keys(parentArgs).map(function(i) {
                  if (i > 1) {
                    args.push(parentArgs[i]);
                  }
                });
                if (that.toBeRemoved(info)) {
                  that.listeners[eventName].splice(index, 1);
                }
                callback.apply(null, args);
              });
            }
          };
        };
        return EventBus2;
      });
    }
  });

  // src/index.ts
  init_live_reload();

  // src/animations/index.ts
  init_live_reload();

  // src/app.ts
  init_live_reload();
  var import_js_event_bus = __toESM(require_src(), 1);

  // node_modules/.pnpm/lenis@1.3.11/node_modules/lenis/dist/lenis.mjs
  init_live_reload();
  var version = "1.3.11";
  function clamp(min, input, max) {
    return Math.max(min, Math.min(input, max));
  }
  function lerp(x, y, t) {
    return (1 - t) * x + t * y;
  }
  function damp(x, y, lambda, deltaTime) {
    return lerp(x, y, 1 - Math.exp(-lambda * deltaTime));
  }
  function modulo(n, d) {
    return (n % d + d) % d;
  }
  var Animate = class {
    isRunning = false;
    value = 0;
    from = 0;
    to = 0;
    currentTime = 0;
    // These are instanciated in the fromTo method
    lerp;
    duration;
    easing;
    onUpdate;
    /**
     * Advance the animation by the given delta time
     *
     * @param deltaTime - The time in seconds to advance the animation
     */
    advance(deltaTime) {
      if (!this.isRunning) return;
      let completed = false;
      if (this.duration && this.easing) {
        this.currentTime += deltaTime;
        const linearProgress = clamp(0, this.currentTime / this.duration, 1);
        completed = linearProgress >= 1;
        const easedProgress = completed ? 1 : this.easing(linearProgress);
        this.value = this.from + (this.to - this.from) * easedProgress;
      } else if (this.lerp) {
        this.value = damp(this.value, this.to, this.lerp * 60, deltaTime);
        if (Math.round(this.value) === this.to) {
          this.value = this.to;
          completed = true;
        }
      } else {
        this.value = this.to;
        completed = true;
      }
      if (completed) {
        this.stop();
      }
      this.onUpdate?.(this.value, completed);
    }
    /** Stop the animation */
    stop() {
      this.isRunning = false;
    }
    /**
     * Set up the animation from a starting value to an ending value
     * with optional parameters for lerping, duration, easing, and onUpdate callback
     *
     * @param from - The starting value
     * @param to - The ending value
     * @param options - Options for the animation
     */
    fromTo(from, to, { lerp: lerp2, duration, easing, onStart, onUpdate }) {
      this.from = this.value = from;
      this.to = to;
      this.lerp = lerp2;
      this.duration = duration;
      this.easing = easing;
      this.currentTime = 0;
      this.isRunning = true;
      onStart?.();
      this.onUpdate = onUpdate;
    }
  };
  function debounce(callback, delay) {
    let timer;
    return function(...args) {
      let context = this;
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = void 0;
        callback.apply(context, args);
      }, delay);
    };
  }
  var Dimensions = class {
    constructor(wrapper, content, { autoResize = true, debounce: debounceValue = 250 } = {}) {
      this.wrapper = wrapper;
      this.content = content;
      if (autoResize) {
        this.debouncedResize = debounce(this.resize, debounceValue);
        if (this.wrapper instanceof Window) {
          window.addEventListener("resize", this.debouncedResize, false);
        } else {
          this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize);
          this.wrapperResizeObserver.observe(this.wrapper);
        }
        this.contentResizeObserver = new ResizeObserver(this.debouncedResize);
        this.contentResizeObserver.observe(this.content);
      }
      this.resize();
    }
    width = 0;
    height = 0;
    scrollHeight = 0;
    scrollWidth = 0;
    // These are instanciated in the constructor as they need information from the options
    debouncedResize;
    wrapperResizeObserver;
    contentResizeObserver;
    destroy() {
      this.wrapperResizeObserver?.disconnect();
      this.contentResizeObserver?.disconnect();
      if (this.wrapper === window && this.debouncedResize) {
        window.removeEventListener("resize", this.debouncedResize, false);
      }
    }
    resize = () => {
      this.onWrapperResize();
      this.onContentResize();
    };
    onWrapperResize = () => {
      if (this.wrapper instanceof Window) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
      } else {
        this.width = this.wrapper.clientWidth;
        this.height = this.wrapper.clientHeight;
      }
    };
    onContentResize = () => {
      if (this.wrapper instanceof Window) {
        this.scrollHeight = this.content.scrollHeight;
        this.scrollWidth = this.content.scrollWidth;
      } else {
        this.scrollHeight = this.wrapper.scrollHeight;
        this.scrollWidth = this.wrapper.scrollWidth;
      }
    };
    get limit() {
      return {
        x: this.scrollWidth - this.width,
        y: this.scrollHeight - this.height
      };
    }
  };
  var Emitter = class {
    events = {};
    /**
     * Emit an event with the given data
     * @param event Event name
     * @param args Data to pass to the event handlers
     */
    emit(event, ...args) {
      let callbacks = this.events[event] || [];
      for (let i = 0, length = callbacks.length; i < length; i++) {
        callbacks[i]?.(...args);
      }
    }
    /**
     * Add a callback to the event
     * @param event Event name
     * @param cb Callback function
     * @returns Unsubscribe function
     */
    on(event, cb) {
      this.events[event]?.push(cb) || (this.events[event] = [cb]);
      return () => {
        this.events[event] = this.events[event]?.filter((i) => cb !== i);
      };
    }
    /**
     * Remove a callback from the event
     * @param event Event name
     * @param callback Callback function
     */
    off(event, callback) {
      this.events[event] = this.events[event]?.filter((i) => callback !== i);
    }
    /**
     * Remove all event listeners and clean up
     */
    destroy() {
      this.events = {};
    }
  };
  var LINE_HEIGHT = 100 / 6;
  var listenerOptions = { passive: false };
  var VirtualScroll = class {
    constructor(element, options = { wheelMultiplier: 1, touchMultiplier: 1 }) {
      this.element = element;
      this.options = options;
      window.addEventListener("resize", this.onWindowResize, false);
      this.onWindowResize();
      this.element.addEventListener("wheel", this.onWheel, listenerOptions);
      this.element.addEventListener(
        "touchstart",
        this.onTouchStart,
        listenerOptions
      );
      this.element.addEventListener(
        "touchmove",
        this.onTouchMove,
        listenerOptions
      );
      this.element.addEventListener("touchend", this.onTouchEnd, listenerOptions);
    }
    touchStart = {
      x: 0,
      y: 0
    };
    lastDelta = {
      x: 0,
      y: 0
    };
    window = {
      width: 0,
      height: 0
    };
    emitter = new Emitter();
    /**
     * Add an event listener for the given event and callback
     *
     * @param event Event name
     * @param callback Callback function
     */
    on(event, callback) {
      return this.emitter.on(event, callback);
    }
    /** Remove all event listeners and clean up */
    destroy() {
      this.emitter.destroy();
      window.removeEventListener("resize", this.onWindowResize, false);
      this.element.removeEventListener("wheel", this.onWheel, listenerOptions);
      this.element.removeEventListener(
        "touchstart",
        this.onTouchStart,
        listenerOptions
      );
      this.element.removeEventListener(
        "touchmove",
        this.onTouchMove,
        listenerOptions
      );
      this.element.removeEventListener(
        "touchend",
        this.onTouchEnd,
        listenerOptions
      );
    }
    /**
     * Event handler for 'touchstart' event
     *
     * @param event Touch event
     */
    onTouchStart = (event) => {
      const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
      this.touchStart.x = clientX;
      this.touchStart.y = clientY;
      this.lastDelta = {
        x: 0,
        y: 0
      };
      this.emitter.emit("scroll", {
        deltaX: 0,
        deltaY: 0,
        event
      });
    };
    /** Event handler for 'touchmove' event */
    onTouchMove = (event) => {
      const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
      const deltaX = -(clientX - this.touchStart.x) * this.options.touchMultiplier;
      const deltaY = -(clientY - this.touchStart.y) * this.options.touchMultiplier;
      this.touchStart.x = clientX;
      this.touchStart.y = clientY;
      this.lastDelta = {
        x: deltaX,
        y: deltaY
      };
      this.emitter.emit("scroll", {
        deltaX,
        deltaY,
        event
      });
    };
    onTouchEnd = (event) => {
      this.emitter.emit("scroll", {
        deltaX: this.lastDelta.x,
        deltaY: this.lastDelta.y,
        event
      });
    };
    /** Event handler for 'wheel' event */
    onWheel = (event) => {
      let { deltaX, deltaY, deltaMode } = event;
      const multiplierX = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? this.window.width : 1;
      const multiplierY = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? this.window.height : 1;
      deltaX *= multiplierX;
      deltaY *= multiplierY;
      deltaX *= this.options.wheelMultiplier;
      deltaY *= this.options.wheelMultiplier;
      this.emitter.emit("scroll", { deltaX, deltaY, event });
    };
    onWindowResize = () => {
      this.window = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    };
  };
  var defaultEasing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
  var Lenis = class {
    _isScrolling = false;
    // true when scroll is animating
    _isStopped = false;
    // true if user should not be able to scroll - enable/disable programmatically
    _isLocked = false;
    // same as isStopped but enabled/disabled when scroll reaches target
    _preventNextNativeScrollEvent = false;
    _resetVelocityTimeout = null;
    __rafID = null;
    /**
     * Whether or not the user is touching the screen
     */
    isTouching;
    /**
     * The time in ms since the lenis instance was created
     */
    time = 0;
    /**
     * User data that will be forwarded through the scroll event
     *
     * @example
     * lenis.scrollTo(100, {
     *   userData: {
     *     foo: 'bar'
     *   }
     * })
     */
    userData = {};
    /**
     * The last velocity of the scroll
     */
    lastVelocity = 0;
    /**
     * The current velocity of the scroll
     */
    velocity = 0;
    /**
     * The direction of the scroll
     */
    direction = 0;
    /**
     * The options passed to the lenis instance
     */
    options;
    /**
     * The target scroll value
     */
    targetScroll;
    /**
     * The animated scroll value
     */
    animatedScroll;
    // These are instanciated here as they don't need information from the options
    animate = new Animate();
    emitter = new Emitter();
    // These are instanciated in the constructor as they need information from the options
    dimensions;
    // This is not private because it's used in the Snap class
    virtualScroll;
    constructor({
      wrapper = window,
      content = document.documentElement,
      eventsTarget = wrapper,
      smoothWheel = true,
      syncTouch = false,
      syncTouchLerp = 0.075,
      touchInertiaExponent = 1.7,
      duration,
      // in seconds
      easing,
      lerp: lerp2 = 0.1,
      infinite = false,
      orientation = "vertical",
      // vertical, horizontal
      gestureOrientation = orientation === "horizontal" ? "both" : "vertical",
      // vertical, horizontal, both
      touchMultiplier = 1,
      wheelMultiplier = 1,
      autoResize = true,
      prevent,
      virtualScroll,
      overscroll = true,
      autoRaf = false,
      anchors = false,
      autoToggle = false,
      // https://caniuse.com/?search=transition-behavior
      allowNestedScroll = false,
      __experimental__naiveDimensions = false
    } = {}) {
      window.lenisVersion = version;
      if (!wrapper || wrapper === document.documentElement) {
        wrapper = window;
      }
      if (typeof duration === "number" && typeof easing !== "function") {
        easing = defaultEasing;
      } else if (typeof easing === "function" && typeof duration !== "number") {
        duration = 1;
      }
      this.options = {
        wrapper,
        content,
        eventsTarget,
        smoothWheel,
        syncTouch,
        syncTouchLerp,
        touchInertiaExponent,
        duration,
        easing,
        lerp: lerp2,
        infinite,
        gestureOrientation,
        orientation,
        touchMultiplier,
        wheelMultiplier,
        autoResize,
        prevent,
        virtualScroll,
        overscroll,
        autoRaf,
        anchors,
        autoToggle,
        allowNestedScroll,
        __experimental__naiveDimensions
      };
      this.dimensions = new Dimensions(wrapper, content, { autoResize });
      this.updateClassName();
      this.targetScroll = this.animatedScroll = this.actualScroll;
      this.options.wrapper.addEventListener("scroll", this.onNativeScroll, false);
      this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, {
        capture: true
      });
      if (this.options.anchors && this.options.wrapper === window) {
        this.options.wrapper.addEventListener(
          "click",
          this.onClick,
          false
        );
      }
      this.options.wrapper.addEventListener(
        "pointerdown",
        this.onPointerDown,
        false
      );
      this.virtualScroll = new VirtualScroll(eventsTarget, {
        touchMultiplier,
        wheelMultiplier
      });
      this.virtualScroll.on("scroll", this.onVirtualScroll);
      if (this.options.autoToggle) {
        this.rootElement.addEventListener("transitionend", this.onTransitionEnd, {
          passive: true
        });
      }
      if (this.options.autoRaf) {
        this.__rafID = requestAnimationFrame(this.raf);
      }
    }
    /**
     * Destroy the lenis instance, remove all event listeners and clean up the class name
     */
    destroy() {
      this.emitter.destroy();
      this.options.wrapper.removeEventListener(
        "scroll",
        this.onNativeScroll,
        false
      );
      this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, {
        capture: true
      });
      this.options.wrapper.removeEventListener(
        "pointerdown",
        this.onPointerDown,
        false
      );
      if (this.options.anchors && this.options.wrapper === window) {
        this.options.wrapper.removeEventListener(
          "click",
          this.onClick,
          false
        );
      }
      this.virtualScroll.destroy();
      this.dimensions.destroy();
      this.cleanUpClassName();
      if (this.__rafID) {
        cancelAnimationFrame(this.__rafID);
      }
    }
    on(event, callback) {
      return this.emitter.on(event, callback);
    }
    off(event, callback) {
      return this.emitter.off(event, callback);
    }
    onScrollEnd = (e) => {
      if (!(e instanceof CustomEvent)) {
        if (this.isScrolling === "smooth" || this.isScrolling === false) {
          e.stopPropagation();
        }
      }
    };
    dispatchScrollendEvent = () => {
      this.options.wrapper.dispatchEvent(
        new CustomEvent("scrollend", {
          bubbles: this.options.wrapper === window,
          // cancelable: false,
          detail: {
            lenisScrollEnd: true
          }
        })
      );
    };
    onTransitionEnd = (event) => {
      if (event.propertyName.includes("overflow")) {
        const property = this.isHorizontal ? "overflow-x" : "overflow-y";
        const overflow = getComputedStyle(this.rootElement)[property];
        if (["hidden", "clip"].includes(overflow)) {
          this.internalStop();
        } else {
          this.internalStart();
        }
      }
    };
    setScroll(scroll) {
      if (this.isHorizontal) {
        this.options.wrapper.scrollTo({ left: scroll, behavior: "instant" });
      } else {
        this.options.wrapper.scrollTo({ top: scroll, behavior: "instant" });
      }
    }
    onClick = (event) => {
      const path = event.composedPath();
      const anchor = path.find(
        (node) => node instanceof HTMLAnchorElement && (node.getAttribute("href")?.startsWith("#") || node.getAttribute("href")?.startsWith("/#") || node.getAttribute("href")?.startsWith("./#"))
      );
      if (anchor) {
        const id = anchor.getAttribute("href");
        if (id) {
          const options = typeof this.options.anchors === "object" && this.options.anchors ? this.options.anchors : void 0;
          let target = `#${id.split("#")[1]}`;
          if (["#", "/#", "./#", "#top", "/#top", "./#top"].includes(id)) {
            target = 0;
          }
          this.scrollTo(target, options);
        }
      }
    };
    onPointerDown = (event) => {
      if (event.button === 1) {
        this.reset();
      }
    };
    onVirtualScroll = (data) => {
      if (typeof this.options.virtualScroll === "function" && this.options.virtualScroll(data) === false)
        return;
      const { deltaX, deltaY, event } = data;
      this.emitter.emit("virtual-scroll", { deltaX, deltaY, event });
      if (event.ctrlKey) return;
      if (event.lenisStopPropagation) return;
      const isTouch = event.type.includes("touch");
      const isWheel = event.type.includes("wheel");
      this.isTouching = event.type === "touchstart" || event.type === "touchmove";
      const isClickOrTap = deltaX === 0 && deltaY === 0;
      const isTapToStop = this.options.syncTouch && isTouch && event.type === "touchstart" && isClickOrTap && !this.isStopped && !this.isLocked;
      if (isTapToStop) {
        this.reset();
        return;
      }
      const isUnknownGesture = this.options.gestureOrientation === "vertical" && deltaY === 0 || this.options.gestureOrientation === "horizontal" && deltaX === 0;
      if (isClickOrTap || isUnknownGesture) {
        return;
      }
      let composedPath = event.composedPath();
      composedPath = composedPath.slice(0, composedPath.indexOf(this.rootElement));
      const prevent = this.options.prevent;
      if (!!composedPath.find(
        (node) => node instanceof HTMLElement && (typeof prevent === "function" && prevent?.(node) || node.hasAttribute?.("data-lenis-prevent") || isTouch && node.hasAttribute?.("data-lenis-prevent-touch") || isWheel && node.hasAttribute?.("data-lenis-prevent-wheel") || this.options.allowNestedScroll && this.checkNestedScroll(node, { deltaX, deltaY }))
      ))
        return;
      if (this.isStopped || this.isLocked) {
        if (event.cancelable) {
          event.preventDefault();
        }
        return;
      }
      const isSmooth = this.options.syncTouch && isTouch || this.options.smoothWheel && isWheel;
      if (!isSmooth) {
        this.isScrolling = "native";
        this.animate.stop();
        event.lenisStopPropagation = true;
        return;
      }
      let delta = deltaY;
      if (this.options.gestureOrientation === "both") {
        delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
      } else if (this.options.gestureOrientation === "horizontal") {
        delta = deltaX;
      }
      if (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && this.limit > 0 && (this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && deltaY > 0 || this.animatedScroll === this.limit && deltaY < 0)) {
        event.lenisStopPropagation = true;
      }
      if (event.cancelable) {
        event.preventDefault();
      }
      const isSyncTouch = isTouch && this.options.syncTouch;
      const isTouchEnd = isTouch && event.type === "touchend";
      const hasTouchInertia = isTouchEnd;
      if (hasTouchInertia) {
        delta = Math.sign(this.velocity) * Math.pow(Math.abs(this.velocity), this.options.touchInertiaExponent);
      }
      this.scrollTo(this.targetScroll + delta, {
        programmatic: false,
        ...isSyncTouch ? {
          lerp: hasTouchInertia ? this.options.syncTouchLerp : 1
          // immediate: !hasTouchInertia,
        } : {
          lerp: this.options.lerp,
          duration: this.options.duration,
          easing: this.options.easing
        }
      });
    };
    /**
     * Force lenis to recalculate the dimensions
     */
    resize() {
      this.dimensions.resize();
      this.animatedScroll = this.targetScroll = this.actualScroll;
      this.emit();
    }
    emit() {
      this.emitter.emit("scroll", this);
    }
    onNativeScroll = () => {
      if (this._resetVelocityTimeout !== null) {
        clearTimeout(this._resetVelocityTimeout);
        this._resetVelocityTimeout = null;
      }
      if (this._preventNextNativeScrollEvent) {
        this._preventNextNativeScrollEvent = false;
        return;
      }
      if (this.isScrolling === false || this.isScrolling === "native") {
        const lastScroll = this.animatedScroll;
        this.animatedScroll = this.targetScroll = this.actualScroll;
        this.lastVelocity = this.velocity;
        this.velocity = this.animatedScroll - lastScroll;
        this.direction = Math.sign(
          this.animatedScroll - lastScroll
        );
        if (!this.isStopped) {
          this.isScrolling = "native";
        }
        this.emit();
        if (this.velocity !== 0) {
          this._resetVelocityTimeout = setTimeout(() => {
            this.lastVelocity = this.velocity;
            this.velocity = 0;
            this.isScrolling = false;
            this.emit();
          }, 400);
        }
      }
    };
    reset() {
      this.isLocked = false;
      this.isScrolling = false;
      this.animatedScroll = this.targetScroll = this.actualScroll;
      this.lastVelocity = this.velocity = 0;
      this.animate.stop();
    }
    /**
     * Start lenis scroll after it has been stopped
     */
    start() {
      if (!this.isStopped) return;
      if (this.options.autoToggle) {
        this.rootElement.style.removeProperty("overflow");
        return;
      }
      this.internalStart();
    }
    internalStart() {
      if (!this.isStopped) return;
      this.reset();
      this.isStopped = false;
      this.emit();
    }
    /**
     * Stop lenis scroll
     */
    stop() {
      if (this.isStopped) return;
      if (this.options.autoToggle) {
        this.rootElement.style.setProperty("overflow", "clip");
        return;
      }
      this.internalStop();
    }
    internalStop() {
      if (this.isStopped) return;
      this.reset();
      this.isStopped = true;
      this.emit();
    }
    /**
     * RequestAnimationFrame for lenis
     *
     * @param time The time in ms from an external clock like `requestAnimationFrame` or Tempus
     */
    raf = (time) => {
      const deltaTime = time - (this.time || time);
      this.time = time;
      this.animate.advance(deltaTime * 1e-3);
      if (this.options.autoRaf) {
        this.__rafID = requestAnimationFrame(this.raf);
      }
    };
    /**
     * Scroll to a target value
     *
     * @param target The target value to scroll to
     * @param options The options for the scroll
     *
     * @example
     * lenis.scrollTo(100, {
     *   offset: 100,
     *   duration: 1,
     *   easing: (t) => 1 - Math.cos((t * Math.PI) / 2),
     *   lerp: 0.1,
     *   onStart: () => {
     *     console.log('onStart')
     *   },
     *   onComplete: () => {
     *     console.log('onComplete')
     *   },
     * })
     */
    scrollTo(target, {
      offset = 0,
      immediate = false,
      lock = false,
      duration = this.options.duration,
      easing = this.options.easing,
      lerp: lerp2 = this.options.lerp,
      onStart,
      onComplete,
      force = false,
      // scroll even if stopped
      programmatic = true,
      // called from outside of the class
      userData
    } = {}) {
      if ((this.isStopped || this.isLocked) && !force) return;
      if (typeof target === "string" && ["top", "left", "start"].includes(target)) {
        target = 0;
      } else if (typeof target === "string" && ["bottom", "right", "end"].includes(target)) {
        target = this.limit;
      } else {
        let node;
        if (typeof target === "string") {
          node = document.querySelector(target);
        } else if (target instanceof HTMLElement && target?.nodeType) {
          node = target;
        }
        if (node) {
          if (this.options.wrapper !== window) {
            const wrapperRect = this.rootElement.getBoundingClientRect();
            offset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
          }
          const rect = node.getBoundingClientRect();
          target = (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll;
        }
      }
      if (typeof target !== "number") return;
      target += offset;
      target = Math.round(target);
      if (this.options.infinite) {
        if (programmatic) {
          this.targetScroll = this.animatedScroll = this.scroll;
          const distance = target - this.animatedScroll;
          if (distance > this.limit / 2) {
            target = target - this.limit;
          } else if (distance < -this.limit / 2) {
            target = target + this.limit;
          }
        }
      } else {
        target = clamp(0, target, this.limit);
      }
      if (target === this.targetScroll) {
        onStart?.(this);
        onComplete?.(this);
        return;
      }
      this.userData = userData ?? {};
      if (immediate) {
        this.animatedScroll = this.targetScroll = target;
        this.setScroll(this.scroll);
        this.reset();
        this.preventNextNativeScrollEvent();
        this.emit();
        onComplete?.(this);
        this.userData = {};
        requestAnimationFrame(() => {
          this.dispatchScrollendEvent();
        });
        return;
      }
      if (!programmatic) {
        this.targetScroll = target;
      }
      if (typeof duration === "number" && typeof easing !== "function") {
        easing = defaultEasing;
      } else if (typeof easing === "function" && typeof duration !== "number") {
        duration = 1;
      }
      this.animate.fromTo(this.animatedScroll, target, {
        duration,
        easing,
        lerp: lerp2,
        onStart: () => {
          if (lock) this.isLocked = true;
          this.isScrolling = "smooth";
          onStart?.(this);
        },
        onUpdate: (value, completed) => {
          this.isScrolling = "smooth";
          this.lastVelocity = this.velocity;
          this.velocity = value - this.animatedScroll;
          this.direction = Math.sign(this.velocity);
          this.animatedScroll = value;
          this.setScroll(this.scroll);
          if (programmatic) {
            this.targetScroll = value;
          }
          if (!completed) this.emit();
          if (completed) {
            this.reset();
            this.emit();
            onComplete?.(this);
            this.userData = {};
            requestAnimationFrame(() => {
              this.dispatchScrollendEvent();
            });
            this.preventNextNativeScrollEvent();
          }
        }
      });
    }
    preventNextNativeScrollEvent() {
      this._preventNextNativeScrollEvent = true;
      requestAnimationFrame(() => {
        this._preventNextNativeScrollEvent = false;
      });
    }
    checkNestedScroll(node, { deltaX, deltaY }) {
      const time = Date.now();
      const cache = node._lenis ??= {};
      let hasOverflowX, hasOverflowY, isScrollableX, isScrollableY, scrollWidth, scrollHeight, clientWidth, clientHeight;
      const gestureOrientation = this.options.gestureOrientation;
      if (time - (cache.time ?? 0) > 2e3) {
        cache.time = Date.now();
        const computedStyle = window.getComputedStyle(node);
        cache.computedStyle = computedStyle;
        const overflowXString = computedStyle.overflowX;
        const overflowYString = computedStyle.overflowY;
        hasOverflowX = ["auto", "overlay", "scroll"].includes(overflowXString);
        hasOverflowY = ["auto", "overlay", "scroll"].includes(overflowYString);
        cache.hasOverflowX = hasOverflowX;
        cache.hasOverflowY = hasOverflowY;
        if (!hasOverflowX && !hasOverflowY) return false;
        if (gestureOrientation === "vertical" && !hasOverflowY) return false;
        if (gestureOrientation === "horizontal" && !hasOverflowX) return false;
        scrollWidth = node.scrollWidth;
        scrollHeight = node.scrollHeight;
        clientWidth = node.clientWidth;
        clientHeight = node.clientHeight;
        isScrollableX = scrollWidth > clientWidth;
        isScrollableY = scrollHeight > clientHeight;
        cache.isScrollableX = isScrollableX;
        cache.isScrollableY = isScrollableY;
        cache.scrollWidth = scrollWidth;
        cache.scrollHeight = scrollHeight;
        cache.clientWidth = clientWidth;
        cache.clientHeight = clientHeight;
      } else {
        isScrollableX = cache.isScrollableX;
        isScrollableY = cache.isScrollableY;
        hasOverflowX = cache.hasOverflowX;
        hasOverflowY = cache.hasOverflowY;
        scrollWidth = cache.scrollWidth;
        scrollHeight = cache.scrollHeight;
        clientWidth = cache.clientWidth;
        clientHeight = cache.clientHeight;
      }
      if (!hasOverflowX && !hasOverflowY || !isScrollableX && !isScrollableY) {
        return false;
      }
      if (gestureOrientation === "vertical" && (!hasOverflowY || !isScrollableY))
        return false;
      if (gestureOrientation === "horizontal" && (!hasOverflowX || !isScrollableX))
        return false;
      let orientation;
      if (gestureOrientation === "horizontal") {
        orientation = "x";
      } else if (gestureOrientation === "vertical") {
        orientation = "y";
      } else {
        const isScrollingX = deltaX !== 0;
        const isScrollingY = deltaY !== 0;
        if (isScrollingX && hasOverflowX && isScrollableX) {
          orientation = "x";
        }
        if (isScrollingY && hasOverflowY && isScrollableY) {
          orientation = "y";
        }
      }
      if (!orientation) return false;
      let scroll, maxScroll, delta, hasOverflow, isScrollable;
      if (orientation === "x") {
        scroll = node.scrollLeft;
        maxScroll = scrollWidth - clientWidth;
        delta = deltaX;
        hasOverflow = hasOverflowX;
        isScrollable = isScrollableX;
      } else if (orientation === "y") {
        scroll = node.scrollTop;
        maxScroll = scrollHeight - clientHeight;
        delta = deltaY;
        hasOverflow = hasOverflowY;
        isScrollable = isScrollableY;
      } else {
        return false;
      }
      const willScroll = delta > 0 ? scroll < maxScroll : scroll > 0;
      return willScroll && hasOverflow && isScrollable;
    }
    /**
     * The root element on which lenis is instanced
     */
    get rootElement() {
      return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
    }
    /**
     * The limit which is the maximum scroll value
     */
    get limit() {
      if (this.options.__experimental__naiveDimensions) {
        if (this.isHorizontal) {
          return this.rootElement.scrollWidth - this.rootElement.clientWidth;
        } else {
          return this.rootElement.scrollHeight - this.rootElement.clientHeight;
        }
      } else {
        return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
      }
    }
    /**
     * Whether or not the scroll is horizontal
     */
    get isHorizontal() {
      return this.options.orientation === "horizontal";
    }
    /**
     * The actual scroll value
     */
    get actualScroll() {
      const wrapper = this.options.wrapper;
      return this.isHorizontal ? wrapper.scrollX ?? wrapper.scrollLeft : wrapper.scrollY ?? wrapper.scrollTop;
    }
    /**
     * The current scroll value
     */
    get scroll() {
      return this.options.infinite ? modulo(this.animatedScroll, this.limit) : this.animatedScroll;
    }
    /**
     * The progress of the scroll relative to the limit
     */
    get progress() {
      return this.limit === 0 ? 1 : this.scroll / this.limit;
    }
    /**
     * Current scroll state
     */
    get isScrolling() {
      return this._isScrolling;
    }
    set isScrolling(value) {
      if (this._isScrolling !== value) {
        this._isScrolling = value;
        this.updateClassName();
      }
    }
    /**
     * Check if lenis is stopped
     */
    get isStopped() {
      return this._isStopped;
    }
    set isStopped(value) {
      if (this._isStopped !== value) {
        this._isStopped = value;
        this.updateClassName();
      }
    }
    /**
     * Check if lenis is locked
     */
    get isLocked() {
      return this._isLocked;
    }
    set isLocked(value) {
      if (this._isLocked !== value) {
        this._isLocked = value;
        this.updateClassName();
      }
    }
    /**
     * Check if lenis is smooth scrolling
     */
    get isSmooth() {
      return this.isScrolling === "smooth";
    }
    /**
     * The class name applied to the wrapper element
     */
    get className() {
      let className = "lenis";
      if (this.options.autoToggle) className += " lenis-autoToggle";
      if (this.isStopped) className += " lenis-stopped";
      if (this.isLocked) className += " lenis-locked";
      if (this.isScrolling) className += " lenis-scrolling";
      if (this.isScrolling === "smooth") className += " lenis-smooth";
      return className;
    }
    updateClassName() {
      this.cleanUpClassName();
      this.rootElement.className = `${this.rootElement.className} ${this.className}`.trim();
    }
    cleanUpClassName() {
      this.rootElement.className = this.rootElement.className.replace(/lenis(-\w+)?/g, "").trim();
    }
  };

  // src/utils/environment.ts
  init_live_reload();
  var environment = () => {
    const { host } = window.location;
    return host.includes("webflow.io") ? "staging" : "production";
  };

  // src/types/index.ts
  init_live_reload();

  // src/types/animations.ts
  init_live_reload();

  // src/types/config.ts
  init_live_reload();

  // src/types/dom.ts
  init_live_reload();

  // src/types/events.ts
  init_live_reload();

  // src/app.ts
  var App = class _App {
    static _instance;
    eventBus;
    initialised = false;
    environment;
    lenis;
    constructor() {
      this.eventBus = new import_js_event_bus.default();
      this.environment = environment();
      this.lenis = new Lenis();
    }
    static getInstance() {
      if (!_App._instance) _App._instance = new _App();
      return _App._instance;
    }
    init() {
      if (this.initialised) {
        return;
      }
      this.smoothScroll();
      this.initialised = true;
      this.eventBus.emit("app:initialized" /* APP_INITIALIZED */);
    }
    smoothScroll() {
      this.lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        this.lenis.raf(time * 1e3);
      });
      gsap.ticker.lagSmoothing(0);
    }
  };

  // src/animations/config.ts
  init_live_reload();
  var initGSAPDefaults = () => {
    const app = App.getInstance();
    gsap.defaults({
      duration: 2,
      ease: "expo.inOut"
    });
    ScrollTrigger.defaults({
      markers: app.environment === "staging"
      // Show markers in staging
    });
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
    });
  };
  var ANIMATION_DEFAULTS = {
    load: {
      duration: 2,
      stagger: 0.1
    },
    entrance: {
      duration: 1.5,
      toggleActions: "play none none none"
    },
    scrub: {
      scrub: 1,
      ease: "expo.out",
      pin: false
    }
  };
  var TRIGGER_DEFAULTS = {
    entrance: {
      start: "top 80%",
      end: "bottom top",
      toggleActions: "play none none none"
    },
    scrub: {
      start: "top bottom",
      end: "bottom top",
      scrub: 1
    }
  };

  // src/animations/manager.ts
  init_live_reload();

  // src/animations/factory.ts
  init_live_reload();

  // src/animations/registry.ts
  init_live_reload();

  // src/animations/timelines/aiTeam.ts
  init_live_reload();

  // src/config/constants.ts
  init_live_reload();
  var attrs = {
    animations: "data-animation",
    elements: "data-element"
  };
  var values = {
    heading: "heading",
    paragraph: "paragraph",
    buttonGroup: "button-group",
    button: "button"
  };

  // src/utils/queryElement.ts
  init_live_reload();
  var queryElement = (query, parent = document) => {
    const element = parent.querySelector(query);
    return element ?? void 0;
  };

  // src/utils/queryElements.ts
  init_live_reload();
  var queryElements = (query, parent = document) => {
    const elements = parent.querySelectorAll(query);
    return elements.length ? [...elements] : [];
  };

  // src/animations/timelines/aiTeam.ts
  var aiTeamTimeline = (element, context) => {
    const track = queryElement(`[${attrs.elements}="track"]`, element);
    if (!track) return;
    const wrap = queryElement(`[${attrs.elements}="wrap"]`, track);
    if (!wrap) return;
    const links = queryElements(`[${attrs.elements}="link"]`, wrap);
    const backgrounds = queryElements(`[${attrs.elements}="background"]`, wrap);
    const thumbnails = queryElements(`[${attrs.elements}="thumbnail"]`, wrap);
    const names = queryElements(`[${attrs.elements}="name"]`, wrap);
    const roles = queryElements(`[${attrs.elements}="role"]`, wrap);
    const wrapHeight = wrap.getBoundingClientRect().height;
    track.style.height = `${wrapHeight * 4}px`;
    wrap.style.top = `${(window.innerHeight - wrapHeight) / 2}px`;
    const tl = gsap.timeline({ defaults: { ease: context?.ease || "none" } });
    links.forEach((link, index) => {
      if (index === 0) {
        gsap.set(link, {
          backgroundColor: "var(--swatch--orange-2)",
          color: "var(--swatch--dark-900)"
        });
      } else {
        gsap.set(backgrounds[index], { "--clip": "100%" });
        gsap.set(thumbnails[index], { "--clip": "100%" });
      }
      if (index !== 0)
        tl.to(link, {
          backgroundColor: "var(--swatch--orange-2)",
          color: "var(--swatch--dark-900)"
        });
      tl.to(
        links[index - 1],
        {
          backgroundColor: "transparent",
          color: "var(--swatch--white)"
        },
        "<"
      );
      tl.to(backgrounds[index], { "--clip": "0%" }, "<0.1");
      tl.to(thumbnails[index], { "--clip": "0%" }, "<0.1");
      tl.to(names, { yPercent: index * -100, stagger: 0.05 }, "<0.1");
      tl.to(roles, { yPercent: index * -100, stagger: 0.05 }, "<0.1");
      tl.addLabel(`link${index}`);
      link.addEventListener("click", () => {
        const { scrollTrigger } = tl;
        if (!scrollTrigger) return;
        const position = scrollTrigger.start + (scrollTrigger.end - scrollTrigger.start) * (tl.labels[`link${index}`] / tl.duration());
        window.scrollTo({ top: position, behavior: "smooth" });
      });
    });
    return tl;
  };
  var getStartAndEnd = () => {
    const element = queryElement(`[${attrs.animations}="aiTeam"]`);
    if (!element) return { start: "top top", end: "bottom bottom" };
    const wrap = queryElement(`[${attrs.elements}="wrap"]`, element);
    if (!wrap) return { start: "top top", end: "bottom bottom" };
    const wrapHeight = wrap.getBoundingClientRect().height;
    const topAndBottom = (window.innerHeight - wrapHeight) / 2;
    return {
      start: `top ${topAndBottom}`,
      end: `bottom ${window.innerHeight - topAndBottom}`
    };
  };
  var aiTeamTriggerConfig = {
    start: getStartAndEnd().start,
    end: getStartAndEnd().end,
    scrub: 1
  };

  // src/animations/timelines/blogCard.ts
  init_live_reload();
  var blogCardTimeline = (element, context) => {
    const tl = gsap.timeline({
      paused: true,
      defaults: {
        duration: context?.duration || 1.5,
        ease: context?.ease || "expo.inOut",
        clearProps: true
      }
    });
    const parent = element.parentElement;
    gsap.set(element, { opacity: 0, yPercent: 10 });
    gsap.set(parent, { rotateX: 5 });
    tl.to(element, { opacity: 1, yPercent: 0 });
    tl.to(parent, { rotateX: 0 }, "<");
    return tl;
  };
  var blogCardTriggerConfig = {
    start: "top bottom",
    scrub: false,
    toggleActions: "play none none none"
  };

  // src/animations/timelines/cardFade.ts
  init_live_reload();
  var cardFadeTimeline = (element, context) => {
    const tl = gsap.timeline({
      paused: true,
      defaults: { duration: context?.duration || 1.5, ease: context?.ease || "expo.inOut" }
    });
    const cards = queryElements('[data-element="card"]', element);
    if (!cards.length) return;
    tl.from(cards, { y: "1.5rem", opacity: 0, stagger: 0.1 });
    return tl;
  };

  // src/animations/timelines/cardFlip.ts
  init_live_reload();

  // src/types/thresholds.ts
  init_live_reload();

  // src/utils/containerThreshold.ts
  init_live_reload();
  var containerThreshold = (container, threshold, direction = "below") => {
    const rootFontSize = parseFloat(getComputedStyle(document.body).fontSize);
    const containerRect = container.getBoundingClientRect();
    const containerWidthInRems = containerRect.width / rootFontSize;
    if (direction === "above") return containerWidthInRems >= threshold;
    return containerWidthInRems < threshold;
  };

  // src/animations/timelines/cardFlip.ts
  var cardFlipTimeline = (element, context) => {
    const tl = gsap.timeline({
      paused: true,
      defaults: { duration: context?.duration || 1.5, ease: context?.ease || "expo.inOut" }
    });
    const cards = queryElements('[data-element="card"]', element);
    if (!cards.length) return;
    const numberOfCards = cards.length;
    const remainder = numberOfCards % 2;
    const numberOfCardsNeeded = numberOfCards - remainder;
    const leftCards = cards.slice(0, numberOfCardsNeeded / 2);
    const rightCards = cards.slice(numberOfCards - numberOfCardsNeeded / 2);
    const isAboveThreshold = () => containerThreshold(element, 48 /* medium */, "above");
    cards.forEach((card, index) => {
      gsap.set(card, {
        zIndex: 4 - index,
        opacity: 1 - index * 0.2,
        y: isAboveThreshold() ? `${(index + 3) * 1}rem` : `${index * -100}%`
      });
    });
    leftCards.forEach((card) => {
      gsap.set(card, { xPercent: isAboveThreshold() ? 100 : 0 });
    });
    rightCards.forEach((card) => {
      gsap.set(card, { xPercent: isAboveThreshold() ? -100 : 0 });
    });
    tl.to(cards, { xPercent: 0, opacity: 1, y: 0, stagger: 0.2 });
    return tl;
  };
  var cardFlipTriggerConfig = {
    start: "top 80%",
    end: "bottom center",
    scrub: false,
    toggleActions: "play none none none"
  };

  // src/animations/timelines/contentHeader.ts
  init_live_reload();
  var contentHeaderTimeline = (element, context) => {
    const tl = gsap.timeline({
      paused: true,
      defaults: { duration: context?.duration || 1.5, ease: context?.ease || "expo.inOut" }
    });
    const heading = queryElement(`[${attrs.elements}="${values.heading}"] > *`, element);
    const paragraphs = queryElements(`[${attrs.elements}="${values.paragraph}"] > *`, element);
    const buttons = queryElements(`[${attrs.elements}="${values.button}"]`, element);
    if (heading) {
      const splitHeading = new SplitText(heading, { type: "lines", mask: "lines" });
      tl.from(splitHeading.lines, { yPercent: 100, stagger: 0.1 });
    }
    if (paragraphs) {
      paragraphs.forEach((paragraph, index) => {
        const splitParagraph = new SplitText(paragraph, { type: "lines", mask: "lines" });
        tl.from(
          splitParagraph.lines,
          { yPercent: 100, stagger: 0.1 },
          index === 0 ? "<0.2" : "<0.05"
        );
      });
    }
    if (buttons) {
      tl.from(buttons, { opacity: 0, x: "1rem", stagger: 0.1 }, "<0.2");
    }
    return tl;
  };
  var contentHeaderTriggerConfig = {
    start: "top 80%",
    end: "bottom top",
    scrub: false,
    toggleActions: "play none none none"
  };

  // src/animations/timelines/footer.ts
  init_live_reload();
  var footerTimeline = (element, context) => {
    const tl = gsap.timeline({
      defaults: { duration: context?.duration || 1, ease: "none", clearProps: true }
    });
    const inner = queryElement('[data-element="inner"]');
    const footer = queryElement("footer", element);
    if (inner) {
      tl.fromTo(
        inner,
        { y: 0, scaleX: 1, scaleY: 1 },
        {
          y: () => {
            const spacers = queryElements(".u-section-spacer");
            const lastSpacer = spacers[spacers.length - 1];
            return (lastSpacer ? lastSpacer.getBoundingClientRect().height : 160) * -1;
          },
          transformOrigin: "center bottom"
        }
      );
    }
    if (footer) {
      tl.from(footer, { opacity: 0.5, yPercent: 10 }, 0);
    }
    return tl;
  };
  var footerTriggerConfig = {
    start: "top center",
    end: "bottom bottom",
    scrub: 1
  };

  // src/animations/timelines/hero.ts
  init_live_reload();

  // src/animations/utils/moveY.ts
  init_live_reload();
  var isUsed = false;
  var moveY = (using) => {
    if (using) isUsed = true;
    const spacer = queryElement(".u-section-spacer");
    const height = spacer ? spacer.getBoundingClientRect().height : 160;
    return { height, isUsed };
  };

  // src/animations/timelines/hero.ts
  var heroTimeline = (element, context) => {
    const tl = gsap.timeline({
      paused: true,
      defaults: {
        duration: context?.duration || 2,
        ease: context?.ease || "expo.inOut",
        clearProps: true
      }
    });
    const nav2 = queryElement(`.nav_component`);
    const inner = queryElement('[data-element="inner"]');
    const title = queryElement("h1", element);
    if (nav2) {
      tl.from(nav2, { opacity: 0, y: "-1rem" });
    }
    if (inner) {
      tl.fromTo(
        inner,
        {
          opacity: 0,
          y: () => moveY(true).height
        },
        {
          opacity: 1,
          y: 0
        },
        0
      );
    }
    if (title) {
      const splitTitle = new SplitText(title, { type: "lines", mask: "lines" });
      tl.from(splitTitle.lines, { yPercent: 100, stagger: 0.01 }, 0.2);
    }
    if (context?.speed === "fast") {
      tl.timeScale(1.5);
    } else if (context?.speed === "slow") {
      tl.timeScale(0.7);
    }
    return tl;
  };
  var heroTriggerConfig = {
    start: "bottom bottom",
    end: "bottom top",
    scrub: false,
    toggleActions: "play none none none"
  };

  // src/animations/timelines/modern.ts
  init_live_reload();
  var modernTimeline = (element, context) => {
    const tl = gsap.timeline({
      paused: true,
      defaults: { duration: context?.duration || 1.5, ease: context?.ease || "expo.inOut" }
    });
    const eyebrowMarker = queryElement(".eyebrow_marker", element);
    const eyebrowText = queryElement(".eyebrow_text", element);
    const contentBlocks = queryElements(".c-heading > *", element);
    if (eyebrowMarker) {
      tl.from(eyebrowMarker, { opacity: 0, scale: 0.9, duration: 1.5 });
    }
    if (eyebrowText) {
      const splitTitle = new SplitText(eyebrowText, { type: "lines", mask: "lines" });
      tl.from(splitTitle.lines, { opacity: 0, x: "-1rem", duration: 1.5, stagger: 0.1 }, 0.1);
    }
    if (contentBlocks) {
      contentBlocks.forEach((block, index) => {
        const splitTitle = new SplitText(block, { type: "lines", mask: "lines" });
        const position = index === 0 ? 0.1 : ">-1.5";
        tl.from(splitTitle.lines, { yPercent: 100, stagger: 0.15 }, position);
      });
    }
    return tl;
  };
  var modernTriggerConfig = {
    start: "top 80%",
    end: "bottom top",
    scrub: false,
    toggleActions: "play none none none"
  };

  // src/animations/timelines/panels.ts
  init_live_reload();
  var panelsTimeline = (element, context) => {
    const parent = element.parentElement;
    const isLastPanel = (() => {
      if (!parent) return true;
      const allPanels = Array.from(parent.querySelectorAll('[data-animation="panel"]'));
      const currentIndex = allPanels.indexOf(element);
      return currentIndex === allPanels.length - 1;
    })();
    if (isLastPanel) return;
    const tl = gsap.timeline({ defaults: { ease: context?.ease || "expo.out" } });
    tl.to(element, { opacity: 0, scale: 0.8, transformOrigin: "center bottom", duration: 1 });
    return tl;
  };
  var panelsTriggerConfig = {
    start: "top top",
    end: "bottom top",
    scrub: 1
  };

  // src/animations/timelines/reveal.ts
  init_live_reload();
  var revealTimeline = (element, context) => {
    const tl = gsap.timeline({ defaults: { ease: context?.ease || "expo.inOut" } });
    const attr = "data-reveal";
    const container = element.closest(`[${attr}="container"]`);
    const background = queryElement(`[${attr}="background"]`, element);
    const bottom = queryElement(`[${attr}="bottom"]`, element);
    const top = queryElement(`[${attr}="top"]`, element);
    if (!container || !background || !bottom || !top) return;
    container.observeContainer("(width < 48rem)", (match) => {
      if (match) {
        gsap.set(top, { minHeight: bottom.getBoundingClientRect().height });
        tl.fromTo(background, { height: top.getBoundingClientRect().height }, { height: "100%" });
        tl.from(bottom, { yPercent: -100 }, "<");
      } else {
        tl.from(background, { width: "50%" });
        tl.from(bottom, { xPercent: 50 }, "<");
        tl.from(top, { xPercent: -50 }, "<");
      }
    });
    if (context?.speed === "fast") {
      tl.timeScale(1.5);
    } else if (context?.speed === "slow") {
      tl.timeScale(0.7);
    }
    return tl;
  };
  var getStart = () => {
    const firstReveal = queryElement('[data-animation="reveal"]');
    if (!firstReveal) return "top center";
    const firstRect = firstReveal.getBoundingClientRect();
    const { top, height } = firstRect;
    const windowHeight = window.innerHeight;
    const center = windowHeight / 2;
    const belowCenterDistance = center + height;
    const belowCenterPercentage = belowCenterDistance / windowHeight;
    const startingPositionPercentage = top / windowHeight;
    const percentage = startingPositionPercentage >= 1 ? belowCenterPercentage : startingPositionPercentage >= belowCenterPercentage ? startingPositionPercentage : belowCenterPercentage;
    return `top ${percentage * 100}%`;
  };
  var revealTriggerConfig = {
    start: getStart(),
    end: "bottom center",
    scrub: 1
  };

  // src/animations/registry.ts
  var timelineRegistry = {
    // nav: {
    //   create: navTimeline,
    //   triggerConfig: navTriggerConfig,
    //   defaultTrigger: 'scrub',
    // },
    // Hero animation - typically loads on page load
    hero: {
      create: heroTimeline,
      triggerConfig: heroTriggerConfig,
      defaultTrigger: "load"
    },
    // Modern section animation - entrance on scroll
    modern: {
      create: modernTimeline,
      triggerConfig: modernTriggerConfig,
      defaultTrigger: "entrance"
    },
    // Panel animation - scrubs with scroll
    panel: {
      create: panelsTimeline,
      triggerConfig: panelsTriggerConfig,
      defaultTrigger: "scrub"
    },
    footer: {
      create: footerTimeline,
      triggerConfig: footerTriggerConfig,
      defaultTrigger: "scrub"
    },
    reveal: {
      create: revealTimeline,
      triggerConfig: revealTriggerConfig,
      defaultTrigger: "scrub"
    },
    cardFlip: {
      create: cardFlipTimeline,
      triggerConfig: cardFlipTriggerConfig,
      defaultTrigger: "entrance"
    },
    cardFade: {
      create: cardFadeTimeline,
      triggerConfig: cardFlipTriggerConfig,
      defaultTrigger: "entrance"
    },
    contentHeader: {
      create: contentHeaderTimeline,
      triggerConfig: contentHeaderTriggerConfig,
      defaultTrigger: "entrance"
    },
    aiTeam: {
      create: aiTeamTimeline,
      triggerConfig: aiTeamTriggerConfig,
      defaultTrigger: "scrub"
    },
    blogCard: {
      create: blogCardTimeline,
      triggerConfig: blogCardTriggerConfig,
      defaultTrigger: "entrance"
    }
  };

  // src/animations/factory.ts
  var AnimationFactory = class {
    /**
     * Create a timeline with its configuration
     */
    create(type, element, context) {
      const definition = timelineRegistry[type];
      if (!definition) {
        console.warn(`Animation type "${type}" not found in registry`);
        const timeline2 = gsap.timeline({ paused: true });
        return { timeline: timeline2 };
      }
      const trigger = element.getAttribute("data-trigger") || definition.defaultTrigger || "entrance";
      const animationDefaults = trigger === "load" ? ANIMATION_DEFAULTS.load : trigger === "entrance" ? ANIMATION_DEFAULTS.entrance : trigger === "scrub" ? ANIMATION_DEFAULTS.scrub : {};
      const mergedContext = {
        ...animationDefaults,
        ...context
      };
      const timeline = definition.create(element, mergedContext);
      let triggerConfig;
      if (definition.triggerConfig) {
        triggerConfig = definition.triggerConfig;
      } else {
        const trigger2 = element.getAttribute("data-trigger") || definition.defaultTrigger || "entrance";
        if (trigger2 === "entrance") {
          triggerConfig = TRIGGER_DEFAULTS.entrance;
        } else if (trigger2 === "scrub") {
          triggerConfig = TRIGGER_DEFAULTS.scrub;
        }
      }
      return {
        timeline,
        triggerConfig
      };
    }
    /**
     * Check if an animation type exists
     */
    has(type) {
      return type in timelineRegistry;
    }
    /**
     * Get all available animation types
     */
    getAvailableTypes() {
      return Object.keys(timelineRegistry);
    }
  };

  // src/animations/manager.ts
  var AnimationManager = class _AnimationManager {
    static instance;
    app;
    factory;
    instances = [];
    animationQueue = [];
    heroInstance = null;
    isPlayingQueue = false;
    instanceIdCounter = 0;
    initialized = false;
    allowNaturalTriggers = false;
    // Flag to control when natural triggers can fire
    constructor() {
      this.app = App.getInstance();
      this.factory = new AnimationFactory();
    }
    static getInstance() {
      if (!_AnimationManager.instance) {
        _AnimationManager.instance = new _AnimationManager();
      }
      return _AnimationManager.instance;
    }
    /**
     * Initialize the animation system
     */
    initialize() {
      if (this.initialized) return;
      console.log("Initializing animation system");
      this.scanAndCreateAnimations();
      console.log(`Created ${this.instances.length} animation instances`);
      console.log(this.instances);
      this.initialized = true;
    }
    /**
     * App is ready - determine what should play
     */
    appReady() {
      console.log("App ready, determining animation playback order");
      this.heroInstance = this.instances.find((i) => i.type === "hero") || null;
      let heroVisible = false;
      if (this.heroInstance && this.heroInstance.scrollTrigger) {
        heroVisible = this.heroInstance.scrollTrigger.isActive;
        if (!heroVisible) {
          this.heroInstance.timeline.progress(1);
        }
      }
      const visibleEntranceAnimations = this.instances.filter((instance) => {
        if (instance.trigger !== "entrance") return false;
        if (!instance.scrollTrigger) return false;
        return instance.scrollTrigger.isActive;
      });
      console.log(`Found ${visibleEntranceAnimations.length} visible entrance animations`);
      if (heroVisible && this.heroInstance) {
        this.animationQueue.push(this.heroInstance);
      }
      visibleEntranceAnimations.forEach((animation) => {
        this.animationQueue.push(animation);
      });
      if (this.animationQueue.length > 0) {
        console.log(`Starting animation queue with ${this.animationQueue.length} animations`);
        this.playNextInQueue();
      }
      this.allowNaturalTriggers = true;
      this.app.eventBus.on("animation:completed" /* ANIMATION_COMPLETED */, (eventData) => {
        if (eventData.type === "hero") {
          this.refresh();
        }
      });
    }
    /**
     * Scan DOM for animation elements and create instances
     */
    scanAndCreateAnimations() {
      const elements = document.querySelectorAll("[data-animation]");
      elements.forEach((element) => {
        const type = element.getAttribute("data-animation");
        if (!type) return;
        const trigger = element.getAttribute("data-trigger") || "entrance";
        const context = this.extractContext(element);
        const { timeline, triggerConfig } = this.factory.create(type, element, context);
        if (!timeline) return;
        const id = `${type}_${this.instanceIdCounter += 1}`;
        const instance = {
          id,
          element,
          type,
          timeline,
          trigger,
          state: "pending",
          triggerConfig,
          context
        };
        if ((trigger === "entrance" || trigger === "scrub" || trigger === "load") && triggerConfig) {
          if (trigger === "scrub") {
            instance.scrollTrigger = ScrollTrigger.create({
              trigger: element,
              ...triggerConfig,
              animation: timeline
            });
          } else {
            instance.scrollTrigger = ScrollTrigger.create({
              trigger: element,
              ...triggerConfig,
              onToggle: (self) => {
                if (!this.allowNaturalTriggers) return;
                if (trigger === "entrance" && instance.state === "pending" && self.isActive && !this.animationQueue.includes(instance)) {
                  console.log(`ScrollTrigger playing ${type} naturally`);
                  this.playAnimation(instance);
                }
              }
            });
          }
        }
        if (trigger === "event") {
          const eventName = element.getAttribute("data-event") || type;
          this.app.eventBus.on(eventName, (data) => {
            if (instance.state === "pending") {
              this.playAnimation(instance, data);
            }
          });
        }
        this.instances.push(instance);
      });
      this.app.eventBus.emit("animations:initialized" /* ANIMATIONS_INITIALIZED */, {
        instanceCount: this.instances.length
      });
    }
    /**
     * Play the next animation in the queue
     */
    playNextInQueue() {
      if (this.animationQueue.length === 0) {
        this.isPlayingQueue = false;
        console.log("Animation queue complete");
        return;
      }
      this.isPlayingQueue = true;
      const nextAnimation = this.animationQueue.shift();
      console.log(`Playing queued animation: ${nextAnimation.type} (${nextAnimation.id})`);
      nextAnimation.timeline.eventCallback("onStart", () => {
        setTimeout(() => {
          this.playNextInQueue();
        }, 500);
      });
      nextAnimation.timeline.eventCallback("onComplete", () => {
        console.log("Animation completed", nextAnimation);
        ScrollTrigger.refresh();
        this.handleAnimationComplete(nextAnimation);
      });
      this.playAnimation(nextAnimation);
    }
    /**
     * Play a specific animation
     */
    playAnimation(instance, eventData) {
      if (instance.state !== "pending") return;
      console.log(`Playing animation: ${instance.type} (${instance.id})`);
      instance.state = "playing";
      this.handleAnimationStart(instance);
      instance.timeline.restart(true);
      if (!this.isPlayingQueue) {
        instance.timeline.eventCallback("onComplete", () => {
          this.handleAnimationComplete(instance);
        });
      }
    }
    /**
     * Extract context data from element attributes
     */
    extractContext(element) {
      const context = {};
      const { attributes } = element;
      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        if (attr.name.startsWith("data-context-")) {
          const key = attr.name.replace("data-context-", "");
          context[key] = attr.value;
        }
      }
      return context;
    }
    /**
     * Handle animation start
     */
    handleAnimationStart(instance) {
      const eventData = {
        id: instance.id,
        type: instance.type,
        element: instance.element,
        state: "playing",
        context: instance.context
      };
      this.app.eventBus.emit("animation:started" /* ANIMATION_STARTED */, null, eventData);
    }
    /**
     * Handle animation completion
     */
    handleAnimationComplete(instance) {
      instance.state = "completed";
      const eventData = {
        id: instance.id,
        type: instance.type,
        element: instance.element,
        state: "completed",
        context: instance.context
      };
      this.app.eventBus.emit("animation:completed" /* ANIMATION_COMPLETED */, null, eventData);
    }
    /**
     * Get all instances of a specific animation type
     */
    getInstancesByType(type) {
      return this.instances.filter((i) => i.type === type);
    }
    /**
     * Get a specific instance by ID
     */
    getInstance(id) {
      return this.instances.find((i) => i.id === id);
    }
    /**
     * Manually trigger an animation
     */
    trigger(type, context) {
      const instances = this.getInstancesByType(type);
      instances.forEach((instance) => {
        if (instance.state === "pending") {
          this.playAnimation(instance, context);
        }
      });
    }
    /**
     * Refresh all ScrollTriggers
     */
    refresh() {
      ScrollTrigger.refresh();
    }
    /**
     * Clean up all animations
     */
    destroy() {
      this.instances.forEach((instance) => {
        instance.timeline.kill();
        instance.scrollTrigger?.kill();
      });
      this.instances = [];
      this.animationQueue = [];
      this.initialized = false;
    }
  };

  // src/animations/index.ts
  var initAnimations = () => {
    const app = App.getInstance();
    initGSAPDefaults();
    const manager = AnimationManager.getInstance();
    manager.initialize();
    app.eventBus.on("app:initialized" /* APP_INITIALIZED */, () => {
      manager.appReady();
    });
  };

  // src/components/index.ts
  init_live_reload();

  // src/components/benefits.ts
  init_live_reload();
  var benefits = () => {
    const attr = "data-benefits";
    const component = queryElement(`[${attr}="component"]`);
    if (!component) return;
    const tagWrap = queryElement(`[${attr}="tag-wrap"]`);
    const list = queryElement(`[${attr}="list"]`);
    if (!tagWrap || !list) return;
    const items = queryElements(`[${attr}="item"]`, list);
    const cta = queryElement(`[${attr}="cta"]`, list);
    if (!items || !cta) return;
    const props = { component, tagWrap, list, items, cta };
    resetBenefits(props);
    formatBenefits(props);
    window.addEventListener("resize", () => {
      resetBenefits(props);
      formatBenefits(props);
    });
    function resetBenefits({ component: component2, tagWrap: tagWrap2, list: list2, items: items2, cta: cta2 }) {
      component2.removeAttribute("style");
      tagWrap2.removeAttribute("style");
      list2.removeAttribute("style");
      items2.forEach((item) => {
        item.removeAttribute("style");
      });
      cta2.removeAttribute("style");
    }
    function formatBenefits({ component: component2, tagWrap: tagWrap2, items: items2, cta: cta2 }) {
      const isAboveThreshold = () => containerThreshold(component2, 48 /* medium */, "above");
      const grid = tagWrap2.closest(".u-grid-above");
      if (!grid) return;
      const gridComputedStyle = getComputedStyle(grid);
      const gridGap = parseFloat(gridComputedStyle.getPropertyValue("row-gap"));
      let paddingTop = isAboveThreshold() ? 0 : tagWrap2.getBoundingClientRect().height + gridGap;
      items2.forEach((item) => {
        const endHeightOfItem = getDistanceFromParagraphToTop(item);
        item.style.paddingTop = `${paddingTop}px`;
        paddingTop += endHeightOfItem;
      });
      cta2.style.paddingTop = `${paddingTop}px`;
      const totalHeight = paddingTop + cta2.getBoundingClientRect().height;
      if (isAboveThreshold()) tagWrap2.style.height = `${totalHeight}px`;
      const ctaPaddingBottom1 = totalHeight - cta2.getBoundingClientRect().height;
      cta2.style.paddingBottom = `${ctaPaddingBottom1}px`;
      component2.style.marginBottom = `${ctaPaddingBottom1 * -1}px`;
      const reversedItems = [...items2].reverse();
      reversedItems.forEach((item) => {
        const paddingBottom = totalHeight - item.getBoundingClientRect().height;
        item.style.paddingBottom = `${paddingBottom}px`;
      });
      items2.forEach((item, index) => {
        if (index === 0) return;
        const computedStyleOfCurrentItem = getComputedStyle(item);
        const previousItem = items2[index - 1];
        const computedStyleOfPreviousItem = getComputedStyle(previousItem);
        const paddingBottom = parseFloat(computedStyleOfPreviousItem.paddingBottom);
        const paddingTop2 = parseFloat(computedStyleOfCurrentItem.paddingTop);
        const marginTop = paddingBottom + paddingTop2;
        item.style.marginTop = `${marginTop * -1}px`;
      });
      const ctaComputedStyleOfCurrentItem = getComputedStyle(cta2);
      const ctaPreviousItem = items2[items2.length - 1];
      const ctaComputedStyleOfPreviousItem = getComputedStyle(ctaPreviousItem);
      const ctaPaddingBottom2 = parseFloat(ctaComputedStyleOfPreviousItem.paddingBottom);
      const ctaPaddingTop = parseFloat(ctaComputedStyleOfCurrentItem.paddingTop);
      const ctaMarginTop = ctaPaddingBottom2 + ctaPaddingTop;
      cta2.style.marginTop = `${ctaMarginTop * -1}px`;
    }
    function getDistanceFromParagraphToTop(item) {
      const paragraph = queryElement(".c-paragraph", item);
      if (!paragraph) return 0;
      const itemRect = item.getBoundingClientRect();
      const paragraphRect = paragraph.getBoundingClientRect();
      const distance = paragraphRect?.top - itemRect?.top;
      return distance;
    }
  };

  // src/components/nav.ts
  init_live_reload();
  var nav = () => {
    const nav2 = queryElement(`[${attrs.elements}="nav"]`);
    const inner = queryElement(`[${attrs.elements}="inner"]`);
    if (!nav2 || !inner) return;
    const variant = "w-variant-144a276f-7272-627f-9552-6194bfeced8d";
    const velocityThreshold = 1e3;
    const timeline = gsap.timeline({ paused: true });
    timeline.to(nav2, { y: "-100%", duration: 1, ease: "expo.inOut" });
    ScrollTrigger.create({
      trigger: inner,
      start: "top top",
      end: "bottom bottom",
      scrub: false,
      onEnter: () => {
        nav2.classList.add(variant);
      },
      onLeaveBack: () => {
        nav2.classList.remove(variant);
      },
      onUpdate: (self) => {
        const { direction } = self;
        const velocity = self.getVelocity();
        if (direction === 1 && velocity >= velocityThreshold) {
          timeline.play();
        } else if (direction === -1) {
          timeline.reverse();
        }
      }
    });
  };

  // src/components/team.ts
  init_live_reload();

  // src/utils/scrollControl.ts
  init_live_reload();
  var scrollControl = {
    /**
     * Disable smooth scrolling (equivalent to body overflow hidden)
     */
    disable() {
      const app = App.getInstance();
      app.lenis.stop();
    },
    /**
     * Enable smooth scrolling (equivalent to removing body overflow hidden)
     */
    enable() {
      const app = App.getInstance();
      app.lenis.start();
    },
    /**
     * Check if smooth scrolling is currently disabled
     */
    isDisabled() {
      const app = App.getInstance();
      return app.lenis.isStopped;
    },
    /**
     * Toggle smooth scrolling state
     */
    toggle() {
      const app = App.getInstance();
      if (app.lenis.isStopped) {
        app.lenis.start();
      } else {
        app.lenis.stop();
      }
    },
    /**
     * Scroll to a specific position with optional smooth animation
     */
    scrollTo(target, options) {
      const app = App.getInstance();
      app.lenis.scrollTo(target, options);
    },
    /**
     * Get current scroll position
     */
    getScroll() {
      const app = App.getInstance();
      return app.lenis.scroll;
    }
  };

  // src/components/team.ts
  var team = () => {
    const navs = document.querySelectorAll(".nav_component");
    const attrKey = "data-team";
    const attrKeyImage = "data-team-image";
    const attrValues = {
      card: "card",
      popup: "popup",
      popupTrigger: "popup-trigger",
      popupClose: "popup-close",
      imageStart: "start",
      imageEnd: "end"
    };
    const popups = queryElements(`[${attrKey}=${attrValues.popup}]`);
    const cards = queryElements(`[${attrKey}=${attrValues.card}]`);
    cards.forEach((card, index) => {
      const popup = popups[index];
      const popupClose = queryElement("button", popup);
      const popupTriggers = queryElements(
        `[${attrKey}=${attrValues.popupTrigger}]`,
        card
      );
      const startContainer = queryElement(
        `[${attrKeyImage}=${attrValues.imageStart}]`,
        card
      );
      const endContainer = queryElement(
        `[${attrKeyImage}=${attrValues.imageEnd}]`,
        popup
      );
      const image = queryElement("img", startContainer);
      if (!popup || !popupTriggers.length || !popupClose || !startContainer || !endContainer || !image) {
        return;
      }
      let isAnimating = false;
      popupTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
          if (isAnimating) return;
          isAnimating = true;
          try {
            const startBounds = image.getBoundingClientRect();
            scrollControl.disable();
            popup.style.display = "flex";
            popup.style.opacity = "0";
            const endBounds = endContainer.getBoundingClientRect();
            const clone = image.cloneNode(true);
            clone.style.cssText = "";
            clone.style.position = "fixed";
            clone.style.left = startBounds.left + "px";
            clone.style.top = startBounds.top + "px";
            clone.style.width = startBounds.width + "px";
            clone.style.height = startBounds.height + "px";
            clone.style.zIndex = "9999";
            clone.style.margin = "0";
            clone.style.padding = "0";
            clone.style.transform = "none";
            clone.style.objectFit = "cover";
            document.body.appendChild(clone);
            image.style.opacity = "0";
            endContainer.appendChild(image);
            image.style.opacity = "1";
            image.style.visibility = "hidden";
            image.style.width = "100%";
            image.style.height = "100%";
            image.style.objectFit = "cover";
            const tl = gsap.timeline();
            tl.to(
              popup,
              {
                opacity: 1,
                duration: 0.8,
                ease: "power2.inOut"
              },
              0
            );
            if (navs) {
              tl.to(
                navs,
                {
                  opacity: 0,
                  duration: 0.8,
                  ease: "power2.inOut",
                  onComplete: () => {
                    navs.forEach((nav2) => {
                      nav2.style.display = "none";
                    });
                  }
                },
                0
              );
            }
            tl.fromTo(
              clone,
              {
                // Starting position (grid position)
                left: startBounds.left,
                top: startBounds.top,
                width: startBounds.width,
                height: startBounds.height
              },
              {
                // Ending position (popup position)
                duration: 0.8,
                left: endBounds.left,
                top: endBounds.top,
                width: endBounds.width,
                height: endBounds.height,
                ease: "power2.inOut",
                onComplete: () => {
                  clone.remove();
                  image.style.visibility = "visible";
                  isAnimating = false;
                }
              },
              0
              // Start at the same time as popup fade
            );
          } catch (error) {
            console.error("Error during opening animation:", error);
            isAnimating = false;
            popup.style.display = "flex";
            popup.style.opacity = "1";
            scrollControl.disable();
          }
        });
      });
      popupClose.addEventListener("click", () => {
        if (isAnimating) return;
        isAnimating = true;
        try {
          const currentImage = queryElement("img", endContainer);
          if (!currentImage) {
            popup.style.display = "none";
            isAnimating = false;
            return;
          }
          const endBounds = currentImage.getBoundingClientRect();
          const startBounds = startContainer.getBoundingClientRect();
          const clone = currentImage.cloneNode(true);
          clone.style.cssText = "";
          clone.style.position = "fixed";
          clone.style.zIndex = "9999";
          clone.style.pointerEvents = "none";
          clone.style.margin = "0";
          clone.style.padding = "0";
          clone.style.transform = "none";
          clone.style.objectFit = "cover";
          document.body.appendChild(clone);
          currentImage.style.visibility = "hidden";
          startContainer.appendChild(currentImage);
          currentImage.style.width = "";
          currentImage.style.height = "";
          currentImage.style.objectFit = "";
          const tl = gsap.timeline({
            onComplete: () => {
              clone.remove();
              currentImage.style.visibility = "visible";
              currentImage.style.opacity = "1";
              popup.style.display = "none";
              scrollControl.enable();
              isAnimating = false;
            }
          });
          tl.to(
            popup,
            {
              opacity: 0,
              duration: 0.8,
              ease: "power2.inOut"
            },
            0
          );
          if (navs) {
            tl.to(
              navs,
              {
                onStart: () => {
                  navs.forEach((nav2) => {
                    nav2.style.removeProperty("display");
                  });
                },
                opacity: 1,
                duration: 0.8,
                ease: "power2.inOut"
              },
              0
            );
          }
          tl.fromTo(
            clone,
            {
              // Starting position (popup position)
              left: endBounds.left,
              top: endBounds.top,
              width: endBounds.width,
              height: endBounds.height
            },
            {
              // Ending position (grid position)
              duration: 0.8,
              left: startBounds.left,
              top: startBounds.top,
              width: startBounds.width,
              height: startBounds.height,
              ease: "power2.inOut"
            },
            0
            // Start at the same time as popup fade
          );
        } catch (error) {
          console.error("Error during closing animation:", error);
          popup.style.display = "none";
          if (image) {
            image.style.opacity = "1";
            image.style.visibility = "visible";
          }
          scrollControl.enable();
          isAnimating = false;
        }
      });
    });
  };

  // src/components/index.ts
  var components = () => {
    nav();
    benefits();
    team();
  };

  // src/index.ts
  window.Webflow ||= [];
  window.Webflow.push(() => {
    initAnimations();
    components();
    const app = App.getInstance();
    app.init();
  });
})();
//# sourceMappingURL=index.js.map
