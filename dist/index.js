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

  // src/utils/getEnvironment.ts
  init_live_reload();
  var getEnvironment = () => {
    const { host } = window.location;
    return host.includes("webflow.io") ? "staging" : "production";
  };

  // src/utils/getParams.ts
  init_live_reload();
  var getParams = () => {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
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
    params;
    lenis;
    debug = false;
    constructor() {
      this.eventBus = new import_js_event_bus.default();
      this.environment = getEnvironment();
      this.params = getParams();
      this.lenis = new Lenis();
      this.debug = this.environment === "staging" && this.params.debug !== void 0;
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
      this.lenis.on("scroll", () => {
        ScrollTrigger.update();
      });
      gsap.ticker.add((time) => {
        this.lenis.raf(time * 1e3);
      });
      gsap.ticker.lagSmoothing(0);
    }
  };

  // src/components/index.ts
  init_live_reload();

  // src/components/aiTeamSlider.ts
  init_live_reload();

  // src/utils/queryElement.ts
  init_live_reload();
  var queryElement = (query, parent = document) => {
    const element = parent.querySelector(query);
    return element ?? void 0;
  };

  // src/components/aiTeamSlider.ts
  var aiTeamSlider = () => {
    const attr = "data-ai-team";
    const component = queryElement(`[${attr}="component"]`);
    if (!component) return;
    const slider = queryElement(`[${attr}="slider"]`, component);
    const button = queryElement(`[${attr}="button"]`, component);
    if (!slider || !button) return;
    const buttonLink = queryElement("[href]", button);
    const buttonText = queryElement(".button_main_text", button);
    if (!buttonLink || !buttonText) return;
    const originalText = buttonText.textContent;
    const options = {
      type: "loop",
      perPage: 1,
      gap: "var(--site--gutter)",
      autoplay: true,
      interval: 4e3,
      arrows: false
    };
    const splide = new Splide(slider, options);
    splide.on("ready", () => {
      updateButton(splide.index);
    });
    splide.on("moved", (newIndex) => {
      updateButton(newIndex);
    });
    splide.mount();
    function updateButton(activeIndex) {
      const activeSlide = splide.Components.Slides.getAt(activeIndex)?.slide;
      if (!activeSlide) return;
      const name = activeSlide.dataset.aiEmployee;
      const link = queryElement("[href]", activeSlide);
      if (!name || !link) return;
      buttonText.textContent = `${originalText} of ${name}`;
      buttonLink.href = link.href;
    }
  };

  // src/components/benefits.ts
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

  // src/utils/queryElements.ts
  init_live_reload();
  var queryElements = (query, parent = document) => {
    const elements = parent.querySelectorAll(query);
    return elements.length ? [...elements] : [];
  };

  // src/components/benefits.ts
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
      gsap.set(component2, { style: "" });
      gsap.set(tagWrap2, { style: "" });
      gsap.set(list2, { style: "" });
      gsap.set(items2, { style: "" });
      gsap.set(cta2, { style: "" });
      ScrollTrigger.refresh();
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
        gsap.set(item, { paddingTop: `${paddingTop}px` });
        paddingTop += endHeightOfItem;
      });
      gsap.set(cta2, { paddingTop: `${paddingTop}px` });
      const totalHeight = paddingTop + cta2.getBoundingClientRect().height;
      if (isAboveThreshold()) gsap.set(tagWrap2, { height: `${totalHeight}px` });
      const ctaPaddingBottom1 = totalHeight - cta2.getBoundingClientRect().height;
      gsap.set(cta2, { paddingBottom: `${ctaPaddingBottom1}px` });
      gsap.set(component2, { marginBottom: `${ctaPaddingBottom1 * -1}px` });
      const reversedItems = [...items2].reverse();
      reversedItems.forEach((item) => {
        const paddingBottom = totalHeight - item.getBoundingClientRect().height;
        gsap.set(item, { paddingBottom: `${paddingBottom}px` });
      });
      items2.forEach((item, index) => {
        if (index === 0) return;
        const computedStyleOfCurrentItem = getComputedStyle(item);
        const previousItem = items2[index - 1];
        const computedStyleOfPreviousItem = getComputedStyle(previousItem);
        const paddingBottom = parseFloat(computedStyleOfPreviousItem.paddingBottom);
        const paddingTop2 = parseFloat(computedStyleOfCurrentItem.paddingTop);
        const marginTop = paddingBottom + paddingTop2;
        gsap.set(item, { marginTop: `${marginTop * -1}px` });
      });
      const ctaComputedStyleOfCurrentItem = getComputedStyle(cta2);
      const ctaPreviousItem = items2[items2.length - 1];
      const ctaComputedStyleOfPreviousItem = getComputedStyle(ctaPreviousItem);
      const ctaPaddingBottom2 = parseFloat(ctaComputedStyleOfPreviousItem.paddingBottom);
      const ctaPaddingTop = parseFloat(ctaComputedStyleOfCurrentItem.paddingTop);
      const ctaMarginTop = ctaPaddingBottom2 + ctaPaddingTop;
      gsap.set(cta2, { marginTop: `${ctaMarginTop * -1}px` });
      ScrollTrigger.refresh();
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

  // src/components/nav.ts
  var nav = () => {
    const nav2 = queryElement(`[${attrs.elements}="nav"]`);
    const outer = queryElement(`[${attrs.elements}="outer"]`);
    const main = queryElement(".page_main");
    const scrollElement = outer || main;
    if (!nav2 || !scrollElement) return;
    const variant = "w-variant-144a276f-7272-627f-9552-6194bfeced8d";
    const velocityThreshold = 1e3;
    const timeline = gsap.timeline({ paused: true });
    timeline.to(nav2, { y: "-100%", duration: 1, ease: "expo.inOut" });
    ScrollTrigger.create({
      trigger: scrollElement,
      start: "top top",
      end: "bottom bottom",
      scrub: false,
      onEnter: () => {
        if (outer) nav2.classList.add(variant);
      },
      onLeaveBack: () => {
        if (outer) nav2.classList.remove(variant);
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

  // src/components/navigateBack.ts
  init_live_reload();
  var navigateBack = () => {
    const attr = "data-navigate";
    const components2 = queryElements(`[${attr}]`);
    if (!components2.length) return;
    components2.forEach((component) => {
      component.addEventListener("click", (event) => {
        event.preventDefault();
        const link = component.dataset.navigate;
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = link ?? "/";
        }
      });
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
      popupClose.addEventListener("click", (event) => {
        event.preventDefault();
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

  // src/components/testimonials.ts
  init_live_reload();
  var testimonials = () => {
    const attr = "data-testimonials";
    const component = queryElement(`.splide[${attr}="component"]`);
    if (!component) return;
    const getThreshold = () => {
      const isBelowLarge = containerThreshold(component, 62 /* large */, "below");
      const isBelowMedium = containerThreshold(component, 48 /* medium */, "below");
      return isBelowMedium ? "small" : isBelowLarge ? "medium" : "large";
    };
    let threshold = getThreshold();
    handleOverlay(threshold);
    const createOptions = (threshold2) => {
      return {
        type: "loop",
        perPage: threshold2 === "small" ? 1 : threshold2 === "medium" ? 2 : 3,
        gap: "var(--site--gutter)",
        autoplay: true,
        interval: 4e3,
        pagination: false,
        arrows: false
      };
    };
    let splide = new Splide(component, createOptions(threshold));
    splide.mount();
    window.addEventListener("resize", () => {
      const newThreshold = getThreshold();
      if (newThreshold !== threshold) {
        threshold = newThreshold;
        splide.destroy(true);
        splide = new Splide(component, createOptions(threshold));
        splide.mount();
        handleOverlay(threshold);
      }
    });
    function handleOverlay(threshold2) {
      const overlay = queryElement(`[${attr}="overlay"]`);
      if (!overlay) return;
      if (threshold2 === "large") overlay.style.removeProperty("display");
      else overlay.style.display = "none";
    }
  };

  // src/components/index.ts
  var components = () => {
    nav();
    benefits();
    team();
    aiTeamSlider();
    testimonials();
    navigateBack();
  };

  // src/newAnimations/index.ts
  init_live_reload();

  // src/newAnimations/defaults.ts
  init_live_reload();
  var defaults = (debug2 = false) => {
    gsap.defaults({
      duration: 2,
      ease: "expo.inOut"
    });
    ScrollTrigger.defaults({
      markers: debug2
      // Show markers if debug
    });
  };

  // src/newAnimations/manager.ts
  init_live_reload();

  // src/newAnimations/registry.ts
  init_live_reload();

  // src/newAnimations/factory.ts
  init_live_reload();
  var createAnimationFactory = (AnimationClass) => {
    return (element) => {
      const animation = new AnimationClass(element);
      return animation.build();
    };
  };

  // src/newAnimations/timelines/aiTeam.ts
  init_live_reload();

  // src/newAnimations/timelines/base/baseAnimation.ts
  init_live_reload();
  var BaseAnimation = class {
    app;
    element;
    timeline;
    constructor(element) {
      this.app = App.getInstance();
      this.element = element;
      this.timeline = gsap.timeline({ paused: true });
    }
    /**
     * Override to provide ScrollTrigger configuration
     */
    getScrollTriggerConfig() {
      return null;
    }
    /**
     * Build and return the complete configuration
     */
    build() {
      this.createTimeline();
      const config = {
        timeline: this.timeline
      };
      const scrollConfig = this.getScrollTriggerConfig();
      if (scrollConfig) {
        config.scrollTriggerConfig = scrollConfig;
      }
      return config;
    }
    /**
     * Helper methods for common animations
     */
    queryElement(selector) {
      return queryElement(selector, this.element);
    }
    queryElements(selector) {
      return queryElements(selector, this.element);
    }
    /**
     * Override to handle resize events
     */
    onResize() {
    }
  };

  // src/newAnimations/timelines/aiTeam.ts
  var AITeamTimeline = class extends BaseAnimation {
    track;
    wrap;
    constructor(element) {
      super(element);
      this.track = this.queryElement(`[${attrs.elements}="track"]`);
      this.wrap = queryElement(`[${attrs.elements}="wrap"]`, this.track);
    }
    createTimeline() {
      const links = queryElements(`[${attrs.elements}="link"]`, this.wrap);
      const backgrounds = queryElements(`[${attrs.elements}="background"]`, this.wrap);
      const thumbnails = queryElements(
        `[${attrs.elements}="thumbnail"]`,
        this.wrap
      );
      const names = queryElements(`[${attrs.elements}="name"]`, this.wrap);
      const roles = queryElements(`[${attrs.elements}="role"]`, this.wrap);
      const descriptions = queryElements(`[${attrs.elements}="description"]`, this.wrap);
      const mobileDescriptions = queryElements(
        `[${attrs.elements}="description-mobile"]`,
        this.wrap
      );
      const wrapHeight = this.wrap.getBoundingClientRect().height;
      this.timeline.set(this.track, { height: `${wrapHeight * 4}px` });
      this.timeline.set(this.wrap, { top: `${(window.innerHeight - wrapHeight) / 2}px` });
      ScrollTrigger.refresh();
      links.forEach((link, index) => {
        if (index !== 0) {
          gsap.set(backgrounds[index], { "--clip": "100%" });
          gsap.set(thumbnails[index], { "--clip": "100%" });
          this.timeline.from(
            link,
            { backgroundColor: "transparent", color: "var(--swatch--light-100)" },
            "<"
          );
          this.timeline.to(
            links[index - 1],
            { backgroundColor: "transparent", color: "var(--swatch--light-100)" },
            "<"
          );
          this.timeline.to(backgrounds[index], { "--clip": "0%" }, "<");
          this.timeline.to(thumbnails[index], { "--clip": "0%" }, "<0.1");
        }
        const nameSplit = new SplitText(names[index], { type: "words", mask: "words" });
        const roleSplit = new SplitText(roles[index], { type: "words", mask: "words" });
        const descriptionTextToSplit = queryElements(`p`, descriptions[index]);
        const mobileDescriptionTextToSplit = queryElements(`p`, mobileDescriptions[index]);
        const descriptionSplit = new SplitText(descriptionTextToSplit, {
          type: "lines",
          mask: "lines"
        });
        const mobileDescriptionSplit = new SplitText(mobileDescriptionTextToSplit, {
          type: "lines",
          mask: "lines"
        });
        if (index !== 0) {
          this.timeline.from(nameSplit.words, { yPercent: 100, stagger: 0.05 }, "<0.1");
          this.timeline.from(roleSplit.words, { yPercent: 100, stagger: 0.05 }, "<0.1");
          this.timeline.from(descriptionSplit.lines, { yPercent: 100, stagger: 0.05 }, "<0.1");
          this.timeline.from(mobileDescriptionSplit.lines, { yPercent: 100, stagger: 0.05 }, "<");
        }
        this.timeline.addLabel(`link${index}`);
        if (index !== links.length - 1) {
          this.timeline.to(nameSplit.words, { yPercent: -100, stagger: 0.05, duration: 1 }, "> 0.5");
          this.timeline.to(roleSplit.words, { yPercent: -100, stagger: 0.05, duration: 1 }, "<");
          this.timeline.to(
            descriptionSplit.lines,
            { yPercent: -100, stagger: 0.05, duration: 1 },
            "<"
          );
          this.timeline.to(
            mobileDescriptionSplit.lines,
            { yPercent: -100, stagger: 0.05, duration: 1 },
            "<"
          );
        }
        link.addEventListener("click", () => {
          const { scrollTrigger } = this.timeline;
          if (!scrollTrigger) return;
          const position = scrollTrigger.start + (scrollTrigger.end - scrollTrigger.start) * (this.timeline.labels[`link${index}`] / this.timeline.duration());
          window.scrollTo({ top: position, behavior: "smooth" });
        });
      });
    }
    getScrollTriggerConfig() {
      const wrapHeight = this.wrap.getBoundingClientRect().height;
      const topAndBottom = (window.innerHeight - wrapHeight) / 2;
      return {
        trigger: this.element,
        start: `top ${topAndBottom}`,
        end: `bottom ${window.innerHeight - topAndBottom}`,
        scrub: 1
      };
    }
  };

  // src/newAnimations/timelines/aiTeamHero.ts
  init_live_reload();
  var AITeamHeroTimeline = class extends BaseAnimation {
    createTimeline() {
      const backBtn = queryElement("[data-navigate]");
      const profiles = this.queryElements("[data-profile]");
      const ditlItems = queryElements(".ditl_item");
      if (profiles.length) {
        this.timeline.fromTo(
          profiles,
          { opacity: 0, y: "2rem", rotateZ: 0 },
          {
            opacity: 1,
            y: 0,
            rotateZ: (index) => {
              const isEven = index % 2 === 0;
              return isEven ? index * -8 : index * 8;
            },
            stagger: 0.1
          }
        );
      }
      if (ditlItems.length) {
        this.timeline.fromTo(
          ditlItems,
          { opacity: 0, y: "2rem" },
          { opacity: 1, y: 0, stagger: 0.1 },
          "-=50%"
        );
      }
      if (backBtn) {
        this.timeline.from(backBtn, { opacity: 0, x: "0.5rem" }, "<0.5");
      }
    }
  };

  // src/newAnimations/timelines/blogCard.ts
  init_live_reload();
  var BlogCardTimeline = class extends BaseAnimation {
    createTimeline() {
      const parent = this.element.parentElement;
      this.timeline.set(this.element, { opacity: 0, yPercent: 10 });
      this.timeline.set(parent, { rotateX: 5 });
      this.timeline.to(this.element, { opacity: 1, yPercent: 0 });
      this.timeline.to(parent, { rotateX: 0 }, "<");
    }
    getScrollTriggerConfig() {
      return {
        trigger: this.element,
        start: "top bottom",
        scrub: false,
        toggleActions: "play none none none"
      };
    }
  };

  // src/newAnimations/timelines/cardFade.ts
  init_live_reload();
  var CardFadeTimeline = class extends BaseAnimation {
    cards;
    leftCards;
    rightCards;
    remainder;
    createTimeline() {
      this.timeline.vars.defaults = { stagger: 0.1, duration: 0.5, ease: "back.inOut" };
      this.cards = this.queryElements('[data-element="card"]');
      if (!this.cards.length) return;
      const numberOfCards = this.cards.length;
      this.remainder = numberOfCards % 2;
      const numberOfCardsNeeded = numberOfCards - this.remainder;
      this.leftCards = this.cards.slice(0, numberOfCardsNeeded / 2);
      this.rightCards = this.cards.slice(numberOfCards - numberOfCardsNeeded / 2);
      this.cards.forEach((card, index) => {
        this.timeline.set(card, {
          height: () => `${Math.max(...this.cards.map((card2) => card2.offsetHeight))}px`,
          zIndex: numberOfCards - index,
          opacity: 1 - index * 0.2
        });
      });
      this.element.observeContainer(`(width < ${62 /* large */}rem)`, (match) => {
        if (match) {
          this.element.observeContainer(`(width < ${30 /* small */}rem)`, (match2) => {
            if (match2) this.thresholdSmall();
            else this.thresholdMedium();
          });
        } else {
          this.thresholdLarge();
        }
      });
    }
    thresholdSmall() {
      this.cards.forEach((card, index) => {
        this.timeline.set(card, {
          x: `${index * 0.5}rem`,
          y: `${index * -100}%`
        });
      });
      this.timeline.to(this.cards, {
        x: 0,
        y: 0,
        opacity: 1
      });
    }
    thresholdMedium() {
      const rowGap = parseFloat(getComputedStyle(this.element).getPropertyValue("row-gap"));
      const columnGap = parseFloat(getComputedStyle(this.element).getPropertyValue("column-gap"));
      this.timeline.set(this.leftCards[0], {
        x: (index, trigger) => trigger.getBoundingClientRect().width / 2 - 2 * columnGap
      });
      this.timeline.set(this.leftCards[1], {
        x: (index, trigger) => -(trigger.getBoundingClientRect().width / 2 + 2 * columnGap),
        y: "1rem"
      });
      this.timeline.set(this.rightCards[0], {
        x: (index, trigger) => trigger.getBoundingClientRect().width / 2 + columnGap,
        y: (index, trigger) => trigger.getBoundingClientRect().height * -1
      });
      this.timeline.set(this.rightCards[1], {
        x: (index, trigger) => -(trigger.getBoundingClientRect().width / 2 - columnGap),
        y: (index, trigger) => trigger.getBoundingClientRect().height * -1 + rowGap
      });
      this.timeline.to(this.cards, {
        x: 0,
        y: 0,
        opacity: 1
      });
    }
    thresholdLarge() {
      this.leftCards.forEach((card, index) => {
        this.timeline.set(card, {
          xPercent: (this.leftCards.length - index - 1) * 100 + (this.remainder === 1 ? 0 : 50)
        });
      });
      this.rightCards.forEach((card, index) => {
        this.timeline.set(card, {
          xPercent: index * -100 - (this.remainder === 1 ? 0 : 50)
        });
      });
      this.cards.forEach((card, index) => {
        this.timeline.set(card, { y: `${index}rem` });
      });
      this.timeline.to(this.cards, { y: 0 });
      this.timeline.to(this.cards, { xPercent: 0, opacity: 1 }, "<0.2");
    }
    getScrollTriggerConfig() {
      return {
        trigger: this.element,
        start: "clamp(top 75%)",
        // end: 'clamp(center center)',
        scrub: false
      };
    }
  };

  // src/newAnimations/timelines/cardFlip.ts
  init_live_reload();
  var CardFlipTimeline = class extends BaseAnimation {
    createTimeline() {
      const cards = this.queryElements('[data-element="card"]');
      if (!cards.length) return;
      const numberOfCards = cards.length;
      const remainder = numberOfCards % 2;
      const numberOfCardsNeeded = numberOfCards - remainder;
      const leftCards = cards.slice(0, numberOfCardsNeeded / 2);
      const rightCards = cards.slice(numberOfCards - numberOfCardsNeeded / 2);
      this.timeline.set(cards, {
        height: () => `${Math.max(...cards.map((card) => card.getBoundingClientRect().height))}px`,
        zIndex: (index) => numberOfCards - index,
        opacity: (index) => 1 - index * 0.2
      });
      this.element.observeContainer(`(width < ${48 /* medium */}rem)`, (match) => {
        if (match) {
          this.timeline.set(cards, {
            x: (index) => `${index}rem`,
            yPercent: (index) => index * -100
          });
          this.timeline.to(cards, {
            x: 0,
            opacity: 1,
            yPercent: 0,
            duration: 1,
            ease: "back.inOut",
            stagger: 0.1
          });
        } else {
          this.timeline.set(leftCards, { xPercent: 100 });
          this.timeline.set(rightCards, { xPercent: -100 });
          this.timeline.set(cards, { y: (index) => `${index}rem` });
          this.timeline.to(cards, {
            y: 0,
            duration: 0.5,
            ease: "back.inOut",
            stagger: 0.1
          });
          this.timeline.to(
            cards,
            { xPercent: 0, opacity: 1, duration: 0.5, ease: "back.inOut", stagger: 0.1 },
            "<0.2"
          );
        }
      });
    }
    getScrollTriggerConfig() {
      return {
        // trigger: this.element,
        // start: 'clamp(top bottom)',
        // end: isBelowThreshold ? 'clamp(top top)' : 'clamp(top center)',
        // scrub: 1,
        trigger: this.element,
        start: "clamp(top 75%)",
        // end: 'clamp(center center)',
        scrub: false
      };
    }
  };

  // src/newAnimations/timelines/contentHeader.ts
  init_live_reload();
  var ContentHeaderTimeline = class extends BaseAnimation {
    createTimeline() {
      this.timeline.vars.defaults = { ease: "expo.out" };
      const heading = this.queryElement(`[${attrs.elements}="${values.heading}"] > *`);
      const paragraphs = this.queryElements(`[${attrs.elements}="${values.paragraph}"] > *`);
      const buttons = this.queryElements(`[${attrs.elements}="${values.button}"]`);
      let isFirstInSequence = true;
      if (heading) {
        const splitHeading = new SplitText(heading, { type: "lines", mask: "lines" });
        this.timeline.from(splitHeading.lines, { yPercent: 100, stagger: 0.1 });
        isFirstInSequence = false;
      }
      if (paragraphs.length > 0) {
        paragraphs.forEach((paragraph, index) => {
          const splitParagraph = new SplitText(paragraph, { type: "lines", mask: "lines" });
          this.timeline.from(
            splitParagraph.lines,
            { yPercent: 100, stagger: 0.1 },
            index === 0 && isFirstInSequence ? 0 : index === 0 ? "<0.2" : "<0.05"
          );
        });
        isFirstInSequence = false;
      }
      if (buttons.length > 0) {
        this.timeline.from(
          buttons,
          { opacity: 0, x: "1rem", stagger: 0.1 },
          isFirstInSequence ? 0 : "<0.2"
        );
      }
    }
    getScrollTriggerConfig() {
      return {
        trigger: this.element,
        start: "clamp(top 80%)",
        // end: 'clamp(center center)',
        scrub: false
      };
    }
  };

  // src/newAnimations/timelines/footer.ts
  init_live_reload();

  // src/newAnimations/utils/panelScale.ts
  init_live_reload();

  // src/utils/getPanelMargin.ts
  init_live_reload();
  var getPanelMargin = () => {
    const panelHorizontal = queryElement(".u-panel-horizontal");
    return panelHorizontal?.getBoundingClientRect().width;
  };

  // src/newAnimations/utils/panelScale.ts
  var panelScale = () => {
    const scale = (window.innerWidth - (getPanelMargin() || 0)) / window.innerWidth;
    return scale;
  };

  // src/newAnimations/timelines/footer.ts
  var FooterTimeline = class extends BaseAnimation {
    attr = "data-footer";
    createTimeline() {
      const { attr } = this;
      const inner = queryElement(`[${attrs.elements}="inner"]`);
      const content = this.queryElement(`[${attr}="content"]`);
      const panel = this.queryElement(`[${attr}="panel"]`);
      const contain = this.queryElement(`[${attr}="contain"]`);
      console.log("footer", { inner, content, panel, contain });
      if (!inner || !content || !panel || !contain) return;
      const firstSpacer = this.queryElement(".u-section-spacer");
      this.timeline.from(content, {
        y: () => (firstSpacer?.getBoundingClientRect().height || 128) * -1,
        ease: "none",
        duration: 2
      });
      this.timeline.to(
        inner,
        {
          scale: () => panelScale(),
          transformOrigin: "center bottom",
          ease: "power2.inOut",
          duration: 1.5
        },
        "<0.5"
      );
    }
    getScrollTriggerConfig() {
      this.timeline._panelInitialised = false;
      return {
        onEnter: (self) => {
          if (this.timeline._panelInitialised) return;
          const panel = this.queryElement(`[${this.attr}="panel"]`);
          const contain = this.queryElement(`[${this.attr}="contain"]`);
          if (!panel || !contain) return;
          const { start, end } = self;
          const distance = end - start;
          const position = (distance - panel.getBoundingClientRect().height) / distance;
          const duration = this.timeline.duration() * (1 - position);
          this.timeline.from(
            panel,
            {
              y: () => getComputedStyle(contain).paddingTop,
              scale: () => panelScale(),
              transformOrigin: "center bottom",
              ease: "none",
              duration
            },
            `${position * 100}%`
          );
          this.timeline._panelInitialised = true;
        },
        onLeaveBack: () => {
          this.timeline.clearProps();
        },
        trigger: this.element,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1
      };
    }
  };

  // src/newAnimations/timelines/hero.ts
  init_live_reload();
  var HeroTimeline = class extends BaseAnimation {
    createTimeline() {
      const attr = "data-hero";
      const nav2 = queryElement(`.nav_component`);
      const outer = queryElement(`[${attrs.elements}="outer"]`);
      const inner = queryElement(`[${attrs.elements}="inner"]`);
      const background = this.queryElement(`[${attr}="background"]`);
      const title = this.queryElement("h1");
      if (!nav2 || !outer || !inner || !background || !title) return;
      const firstSpacer = queryElement(".u-section-spacer", inner);
      const sections = queryElements("section", inner);
      this.timeline.from(nav2, { opacity: 0, y: "-1rem" }, "<");
      this.timeline.from(
        inner,
        {
          y: () => firstSpacer?.getBoundingClientRect().height || 128,
          opacity: 0,
          onStart: () => {
            setTimeout(() => {
              this.app.eventBus.emit("hero:static" /* HERO_STATIC */);
            }, 1e3);
          },
          onComplete: () => {
            ScrollTrigger.refresh();
          }
        },
        0
      );
      this.timeline.from(background, { height: "125%" }, "<0.1");
      const splitTitle = new SplitText(title, { type: "lines", mask: "lines" });
      this.timeline.from(splitTitle.lines, { yPercent: 100, stagger: 0.01 }, "<0.1");
      this.timeline.from(inner, { scale: () => panelScale() }, "<0.1");
      this.timeline.from(sections, { opacity: 0 }, "<");
      this.timeline.eventCallback("onComplete", () => {
        ScrollTrigger.refresh();
      });
    }
  };

  // src/newAnimations/timelines/homeHero.ts
  init_live_reload();

  // src/utils/getVariable.ts
  init_live_reload();
  var getVariable = (varName, element = document.documentElement) => {
    const computedStyle = getComputedStyle(element);
    const value = computedStyle.getPropertyValue(varName);
    if (value === "") return null;
    return parseFloat(value);
  };

  // src/newAnimations/timelines/homeHero.ts
  var HomeHeroTimeline = class extends BaseAnimation {
    content;
    createTimeline() {
      const attr = "data-home-hero";
      const logo = this.queryElement(`[${attr}="logo"]`);
      this.content = this.queryElement(`[${attr}="content"]`);
      const background = this.queryElement(`[${attr}="background"]`);
      const title = this.queryElement(`[${attr}="title"]`);
      const prompt = this.queryElement(`[${attr}="prompt"]`);
      const rings = this.queryElements(`[${attr}="ring"]`);
      const assets = this.queryElements(`[${attr}="asset"]`);
      if (!logo || !this.content || !background || !title || !prompt || !rings || !assets) return;
      this.setBaseVars();
      const firstAsset = assets[0];
      const allOtherAssets = assets.slice(1).filter((asset) => !!getVariable("--ha-width", asset));
      allOtherAssets.forEach((asset) => this.setAssetRadius(asset));
      const titleSplit = new SplitText(title, { type: "lines", mask: "lines" });
      const promptSplit = new SplitText(prompt, { type: "lines", mask: "lines" });
      this.timeline.set(this.content, { clipPath: "inset(50%)" });
      this.timeline.set(background, { opacity: 0, width: "0%", height: "0%" });
      this.timeline.to(background, { opacity: 1, duration: 0.25 });
      this.timeline.to(this.content, { clipPath: "inset(0%)", duration: 1.5 }, "<");
      this.timeline.to(background, { width: "100%", height: "100%", duration: 1.5 }, "<");
      this.timeline.from(titleSplit.lines, { yPercent: 100, stagger: 0.1 }, "<0.1");
      this.timeline.from(promptSplit.lines, { yPercent: 100, stagger: 0.1 }, "<0.5");
      this.timeline.to(promptSplit.lines, { yPercent: -100, stagger: 0.1 }, ">-0.5");
      this.timeline.from(
        firstAsset,
        { opacity: 0, scale: 0.5, transformOrigin: "center center" },
        "<"
      );
      this.timeline.to(title, { opacity: 0 }, "<");
      this.timeline.from(
        rings,
        {
          opacity: 0,
          "--hr-width": (index, trigger) => {
            const width = getVariable("--hr-width", trigger);
            return width ? width / 2 : trigger.offsetWidth / 2;
          },
          stagger: 0.1
        },
        "<0.25"
      );
      const topVar = "--ha-top";
      const bottomVar = "--ha-bottom";
      const leftVar = "--ha-left";
      const rightVar = "--ha-right";
      allOtherAssets.forEach((asset, index) => {
        const top = getVariable(topVar, asset);
        const bottom = getVariable(bottomVar, asset);
        const left = getVariable(leftVar, asset);
        const right = getVariable(rightVar, asset);
        const fromOptions = {
          opacity: 0,
          duration: 0.25
          // backdropFilter: 'blur(1rem)',
        };
        if (top) fromOptions[topVar] = top * 2;
        if (bottom) fromOptions[bottomVar] = bottom * 2;
        if (left) fromOptions[leftVar] = left * 2;
        if (right) fromOptions[rightVar] = right * 2;
        const toOptions = {
          opacity: 1
          // backdropFilter: 'blur(1rem)',
        };
        if (top) toOptions[topVar] = top;
        if (bottom) toOptions[bottomVar] = bottom;
        if (left) toOptions[leftVar] = left;
        if (right) toOptions[rightVar] = right;
        this.timeline.fromTo(
          asset,
          fromOptions,
          toOptions,
          index === 0 ? "<1" : `<${index * 75e-4}`
        );
      });
      window.addEventListener("resize", () => {
        this.setBaseVars();
        allOtherAssets.forEach((asset) => this.setAssetRadius(asset));
        ScrollTrigger.refresh();
      });
    }
    getScrollTriggerConfig() {
      return {
        trigger: this.element,
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      };
    }
    setBaseVars() {
      if (!this.content) return;
      const widthVar = "--hv-width";
      const heightVar = "--hv-height";
      this.content.style.removeProperty(widthVar);
      this.content.style.removeProperty(heightVar);
      const widthDefault = getVariable(widthVar, this.content);
      const heightDefault = getVariable(heightVar, this.content);
      if (!widthDefault || !heightDefault) return;
      const defaultAspectRatio = widthDefault / heightDefault;
      const contentRect = this.content.getBoundingClientRect();
      const currentAspectRatio = contentRect.width / contentRect.height;
      const scale = currentAspectRatio / defaultAspectRatio;
      const width = widthDefault * scale;
      const height = heightDefault * scale;
      gsap.set(this.content, { [widthVar]: width, [heightVar]: height });
    }
    setAssetRadius(asset) {
      const hlRadius = getVariable("--hl-radius", asset);
      const hlWidth = getVariable("--hl-width", asset);
      if (!hlRadius || !hlWidth) return;
      const hlHeight = hlWidth * (asset.offsetHeight / asset.offsetWidth);
      const radius = hlRadius * (asset.offsetWidth / hlWidth + asset.offsetHeight / hlHeight) / 2;
      asset.style.borderRadius = `${radius}px`;
    }
  };

  // src/newAnimations/timelines/industries.ts
  init_live_reload();

  // src/utils/debug.ts
  init_live_reload();
  var debug = (type, message, data) => {
    const app = App.getInstance();
    const { environment } = app;
    if (environment !== "staging") return;
    console[type](message, data);
  };

  // src/newAnimations/timelines/industries.ts
  var IndustriesTimeline = class extends BaseAnimation {
    createTimeline() {
      const attr = "data-industry";
      const track = this.queryElement(`[${attr}="track"]`);
      const sticky = this.queryElement(`[${attr}="sticky"]`);
      const assetsCollection = this.queryElement(`[${attr}="assets-collection"]`);
      const assetsList = this.queryElement(`[${attr}="assets-list"]`);
      const assets = this.queryElements(`[${attr}="asset"]`);
      const namesWrap = this.queryElement(`[${attr}="names-wrap"]`);
      const names = this.queryElements(`[${attr}="name"]`);
      if (!track || !sticky || !assetsCollection || !assetsList || assets.length === 0 || !namesWrap || names.length === 0) {
        debug("warn", "industriesTimeline", {
          track,
          sticky,
          assetsCollection,
          assetsList,
          namesWrap,
          names
        });
        return;
      }
      const assetsTl = gsap.timeline({ defaults: { ease: "none" } });
      const namesTl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
      namesTl.set(names, { yPercent: 100 * 2 });
      names.forEach((name, index) => {
        if (index === 0) return;
        const position = 200 + -100 * index;
        namesTl.to(names, { yPercent: position });
      });
      this.element.observeContainer(`(width < ${48 /* medium */}em)`, (match) => {
        if (match) {
          const assetWidth = assets[0].getBoundingClientRect().width;
          const moveListBy = assetWidth * (assets.length - 1);
          const elementHeight = this.element.getBoundingClientRect().height;
          const listHeight = assetsList.getBoundingClientRect().height;
          const trackHeight = elementHeight - listHeight + moveListBy;
          this.timeline.set(track, { height: `${trackHeight}px` });
          assetsTl.to(assets, { x: -moveListBy });
        } else {
          const stickyHeight = sticky.getBoundingClientRect().height;
          const assetsCollectionHeight = assetsCollection.getBoundingClientRect().height;
          const assetsListHeight = assetsList.getBoundingClientRect().height;
          const moveListBy = assetsListHeight - assetsCollectionHeight;
          const trackHeight = stickyHeight - assetsCollectionHeight + assetsListHeight;
          this.timeline.set(track, { height: `${trackHeight}px` });
          assets.forEach((asset, index) => {
            const position = moveListBy / assets.length * (index + 1) * -1;
            assetsTl.to(assets, { y: position });
          });
        }
      });
      assetsTl.duration(1);
      namesTl.duration(1);
      this.timeline.add(assetsTl);
      this.timeline.add(namesTl, "<");
    }
    getScrollTriggerConfig() {
      return {
        trigger: this.element,
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      };
    }
  };

  // src/newAnimations/timelines/logos.ts
  init_live_reload();
  var LogosTimeline = class extends BaseAnimation {
    createTimeline() {
      const attr = "data-logos";
      const logos = this.queryElements(`[${attr}="logo"]`);
      if (logos.length === 0) return;
      this.timeline.fromTo(logos, { yPercent: 100 }, { yPercent: 0, stagger: 0.1 });
    }
    getScrollTriggerConfig() {
      return {
        trigger: this.element,
        start: "top 80%",
        scrub: false,
        toggleActions: "play none none none"
      };
    }
  };

  // src/newAnimations/timelines/modern.ts
  init_live_reload();
  var ModernTimeline = class extends BaseAnimation {
    createTimeline() {
      const eyebrowMarker = this.queryElement(".eyebrow_marker");
      const eyebrowText = this.queryElement(".eyebrow_text");
      const contentBlocks = this.queryElements(".c-heading > *");
      if (!eyebrowMarker || !eyebrowText || !contentBlocks) return;
      this.timeline.from(eyebrowMarker, { opacity: 0, scale: 0.9, duration: 1 });
      const splitTitle = new SplitText(eyebrowText, { type: "lines", mask: "lines" });
      this.timeline.from(
        splitTitle.lines,
        {
          opacity: 0,
          x: "-1rem",
          duration: 1.5,
          stagger: 0.1
        },
        "<0.1"
      );
      contentBlocks.forEach((block, index) => {
        const splitTitle2 = new SplitText(block, { type: "lines", mask: "lines" });
        const position = index === 0 ? "<" : "<0.2";
        this.timeline.from(splitTitle2.lines, { yPercent: 100, stagger: 0.1 }, position);
      });
    }
    getScrollTriggerConfig() {
      return {
        trigger: this.element,
        start: "top 80%",
        end: "bottom top",
        scrub: false,
        toggleActions: "play none none none"
      };
    }
  };

  // src/newAnimations/timelines/panel.ts
  init_live_reload();
  var PanelTimeline = class extends BaseAnimation {
    createTimeline() {
      if (this.checkIfLastPanel()) return;
      this.timeline.to(this.element, {
        opacity: 0,
        ease: "power2.inOut"
      });
      this.timeline.to(
        this.element,
        {
          scale: 0.8,
          transformOrigin: "center bottom"
        },
        "<"
      );
    }
    getScrollTriggerConfig() {
      return {
        trigger: this.element,
        start: "top top",
        end: "bottom top",
        scrub: 1
      };
    }
    checkIfLastPanel() {
      const parent = this.element.closest(".panels_list");
      if (!parent) return true;
      const allPanels = queryElements('[data-animation="panel"]', parent);
      const currentIndex = allPanels.indexOf(this.element);
      return currentIndex === allPanels.length - 1;
    }
  };

  // src/newAnimations/timelines/reveal.ts
  init_live_reload();
  var RevealTimeline = class extends BaseAnimation {
    createTimeline() {
      const attr = "data-reveal";
      const container = this.element.closest(`[${attr}="container"]`);
      const background = this.queryElement(`[${attr}="background"]`);
      const bottom = this.queryElement(`[${attr}="bottom"]`);
      const top = this.queryElement(`[${attr}="top"]`);
      if (!container || !background || !bottom || !top) return;
      container.observeContainer("(width < 48rem)", (match) => {
        if (match) {
          gsap.set(top, { minHeight: bottom.getBoundingClientRect().height });
          this.timeline.fromTo(
            background,
            { height: top.getBoundingClientRect().height },
            { height: "100%" }
          );
          this.timeline.from(bottom, { yPercent: -100 }, "<");
        } else {
          this.timeline.from(background, { width: "50%" });
          this.timeline.from(bottom, { xPercent: 50 }, "<");
          this.timeline.from(top, { xPercent: -50 }, "<");
        }
      });
    }
    getScrollTriggerConfig() {
      return {
        trigger: this.element,
        start: this.getStart(),
        end: "bottom center",
        scrub: 1
      };
    }
    getStart() {
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
    }
  };

  // src/newAnimations/registry.ts
  var registry = {
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
    reveal: createAnimationFactory(RevealTimeline)
  };

  // src/newAnimations/manager.ts
  var AnimationManager = class {
    app;
    animationInstances = /* @__PURE__ */ new Map();
    onLoadAnimations = [];
    onScrollAnimations = [];
    relinkScrollAnimations = /* @__PURE__ */ new Set();
    constructor() {
      this.app = App.getInstance();
    }
    init() {
      const elements = queryElements("[data-animation]");
      if (!elements.length) return;
      elements.forEach((element) => {
        const animationType = element.dataset.animation;
        if (!animationType) return;
        const factory = registry[animationType];
        if (!factory) {
          console.warn(`Animation type "${animationType}" not found`);
          return;
        }
        const config = factory(element);
        this.processAnimation(element, config);
      });
      document.body.setAttribute("data-loaded", "true");
      this.app.eventBus.on("hero:static" /* HERO_STATIC */, () => {
        this.createDeferredScrollTriggers();
      });
      this.playLoadSequence();
      this.storeAnimations([...this.onLoadAnimations, ...this.onScrollAnimations]);
    }
    processAnimation(element, config) {
      const { animation } = element.dataset;
      const { timeline, scrollTriggerConfig } = config;
      if (!scrollTriggerConfig) {
        this.onLoadAnimations.push({ element, timeline });
        return;
      }
      const scrollTrigger = ScrollTrigger.create({
        ...scrollTriggerConfig,
        animation: timeline
      });
      if (this.onLoadAnimations.length <= 1 && ScrollTrigger.isInViewport(element) && animation !== "homeHero") {
        scrollTrigger.kill();
        this.onLoadAnimations.push({
          element,
          timeline,
          scrollTriggerConfig
        });
      } else {
        scrollTrigger.kill();
        this.onScrollAnimations.push({
          element,
          timeline,
          scrollTriggerConfig
        });
      }
    }
    playLoadSequence() {
      console.log("playLoadSequence", this.onLoadAnimations);
      if (this.onLoadAnimations.length === 0) {
        this.app.eventBus.emit("hero:static" /* HERO_STATIC */);
        return;
      }
      this.onLoadAnimations.forEach(({ scrollTrigger, element }) => {
        if (scrollTrigger) {
          scrollTrigger.kill();
          this.relinkScrollAnimations.add(element);
        }
      });
      const master = gsap.timeline({
        paused: true,
        onComplete: () => {
          if (this.relinkScrollAnimations.size > 0) {
            this.setupScrollRelinker();
          }
        }
      });
      this.onLoadAnimations.forEach(({ timeline }, index) => {
        timeline.paused(false);
        const overlap = "50%";
        const position = index === 0 ? 0 : `-=${overlap}`;
        master.add(timeline, position);
      });
      master.play();
    }
    createDeferredScrollTriggers() {
      this.onScrollAnimations.forEach(({ element, timeline, scrollTriggerConfig }) => {
        const scrollTrigger = ScrollTrigger.create({
          ...scrollTriggerConfig,
          animation: timeline
        });
        this.animationInstances.set(element, {
          timeline,
          scrollTrigger,
          scrollTriggerConfig
        });
      });
    }
    setupScrollRelinker() {
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: () => this.checkForRelinking()
      });
    }
    checkForRelinking() {
      this.relinkScrollAnimations.forEach((element) => {
        const instance = this.animationInstances.get(element);
        if (!instance) return;
        if (instance.relinked) return;
        const { timeline, scrollTriggerConfig } = instance;
        if (!scrollTriggerConfig) return;
        const testST = ScrollTrigger.create({
          trigger: scrollTriggerConfig.trigger,
          start: scrollTriggerConfig.start,
          end: scrollTriggerConfig.end
        });
        const isOutOfView = !testST.isActive && testST.progress === 0 || testST.progress === 1;
        if (isOutOfView) {
          testST.kill();
          const newST = ScrollTrigger.create({
            ...scrollTriggerConfig,
            animation: timeline,
            // Ensure timeline progress matches scroll position
            onUpdate: (self) => {
              timeline.progress(self.progress);
            }
          });
          instance.scrollTrigger = newST;
          instance.relinked = true;
          this.relinkScrollAnimations.delete(element);
          console.log(`Relinked animation for element:`, element);
        } else {
          testST.kill();
        }
      });
      if (this.relinkScrollAnimations.size === 0) {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.vars.trigger === document.body && !st.animation) {
            st.kill();
          }
        });
      }
    }
    storeAnimations(animations2) {
      animations2.forEach(({ element, timeline, scrollTrigger, scrollTriggerConfig }) => {
        this.animationInstances.set(element, {
          timeline,
          scrollTrigger,
          scrollTriggerConfig
        });
      });
    }
    refreshScrollTriggers() {
      ScrollTrigger.refresh();
    }
  };

  // src/newAnimations/index.ts
  var animations = () => {
    const app = App.getInstance();
    defaults(app.debug);
    const manager = new AnimationManager();
    app.eventBus.on("app:initialized" /* APP_INITIALIZED */, () => {
      manager.init();
    });
  };

  // src/index.ts
  window.Webflow ||= [];
  window.Webflow.push(() => {
    components();
    animations();
    const app = App.getInstance();
    app.init();
  });
})();
//# sourceMappingURL=index.js.map
