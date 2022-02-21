
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    var getRandomValues;
    var rnds8 = new Uint8Array(16);
    function rng() {
      // lazy load so that environments that need to polyfill have a chance to do so
      if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

        if (!getRandomValues) {
          throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
      }

      return getRandomValues(rnds8);
    }

    var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    function validate(uuid) {
      return typeof uuid === 'string' && REGEX.test(uuid);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */

    var byteToHex = [];

    for (var i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).substr(1));
    }

    function stringify(arr) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
      // of the following:
      // - One or more input array values don't map to a hex octet (leading to
      // "undefined" in the uuid)
      // - Invalid input values for the RFC `version` or `variant` fields

      if (!validate(uuid)) {
        throw TypeError('Stringified UUID is invalid');
      }

      return uuid;
    }

    function v4(options, buf, offset) {
      options = options || {};
      var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        offset = offset || 0;

        for (var i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }

        return buf;
      }

      return stringify(rnds);
    }

    const typeDefs =  {
        "StringUtil": {
            "concat": {
                "args": [
                    "String",
                    "String"
                ],
                "infiniteArgs": true,
                "returns": "String"
            },
            "trim": {
                "args": [
                    "String"
                ],
                "inifiniteArgs": false,
                "returns": "String"
            },
            "length": {
                "args": [
                    "String"
                ],
                "infiniteArgs": false,
                "returns": "Integer"
            },
            "fromInt": {
                "args": [
                    "Integer"
                ],
                "infiniteArgs": false,
                "returns": "String"
            }
        },
        "String": {
            "concat": {
                "args": [
                    "String"
                ],
                "infiniteArgs": true,
                "returns": "String"
            },
            "trim": {
                "args": [],
                "inifiniteArgs": false,
                "returns": "String"
            },
            "prepend": {
                "args": [
                    "String"
                ],
                "infiniteArgs": false,
                "returns": "String"
            },
            "length": {
                "args": [
                    "String"
                ],
                "infiniteArgs": false,
                "returns": "Integer"
            }
        },
        "Integer": {
            "parse": {
                "args": [
                    "String"
                ],
                "infiniteArgs": false,
                "returns": "Integer"
            },
            "add": {
                "args": [
                    "Integer"
                ],
                "infiniteArgs": true,
                "returns": "Integer"
            },
            "subtract": {
                "args": [
                    "Integer"
                ],
                "infiniteArgs": true,
                "returns": "Integer"
            },
            "toString": {
                "args": [],
                "infiniteArgs": false,
                "returns": "String"
            }
        },
        "List": {
            "join": {
                "args": [
                    "String"
                ],
                "infiniteArgs": false,
                "returns": "String"
            }
        }
    };

    const dropDataTemplates = {
        "StringUtil": function(method = "concat") {
            const methodDefinition = typeDefs['StringUtil'][method];
            const definitionArgs = methodDefinition.args;

            return {
                type: "UtilityCallExpression",
                utilityName: "StringUtil",
                utilityMethod: method,
                arguments: definitionArgs.map((argType) => this[argType + "Literal"]({})),
                returns: methodDefinition.returns
            };
        },
        "typeUtil": function({ name, method, returns, variableName }) {
            const methodDefinition = typeDefs[name][method];
            const definitionArgs = methodDefinition.args;

            return {
                type: "UtilityCallExpression",
                variableName,
                utilityName: name,
                utilityMethod: method,
                arguments: definitionArgs.map((argType) => this[argType + "Literal"]({})),
                returns
            };
        },
        "expression": () => {
            const newUuid = v4();
            return {
                type: "ExpressionStatement",
                id: newUuid,
                expression: null
            };
        },
        "AssignmentExpression": ({ name = "", type = ""}) => ({
            type: "AssignmentExpression",
            left: {
                type: "Identifier",
                name,
                returns: type
            },
            right: null
        }),
        "variableExpression": ({ name = "", type = ""}) => ({
            type: "AssignmentExpression",
            left: {
                type: "Identifier",
                name,
                returns: type
            },
            right: null
        }),
        "variableValue": ({ name = "", type = "" }) => ({
            type: "Identifier",
            name,
            returns: type
        }),
        // Capitalizing because it matches the 'type' field in the AST
        "StringLiteral": ({ value = "" }) => ({
            type: "StringLiteral",
            value: value,
            returns: "String"
        }),
        // Capitalizing because it matches the 'type' field in the AST
        "IntegerLiteral": ({ value = 0 }) => ({
            type: "IntegerLiteral",
            value,
            returns: "Integer"
        })
    };

    const getDragData = (event) => JSON.parse(event.dataTransfer.getData('text/json'));
    /**
     * @callback DragCallback
     * @param {DragEvent} event
     */

    /**
     * @param {Object} dragData 
     * @returns {DragCallback}
     */
    const dragStartHandler = (dragData) => (event) => {
        event.dataTransfer.setData('text/json', JSON.stringify(dragData));
        event.dataTransfer.dropEffect = 'copy';
    };


    const dragDataTypeMatchesContext = (dragData, contextType) => {
        if ((dragData.data?.type ?? false) && contextType !== undefined) {
            if (dragData.data.type !== contextType) {
                return false;
            }
            return true;
        }
    };


    // This finds a method for the string util that matches the context's type, if any,
    // so the drop data template can be created with that method as the starting, selected method
    const findReturnTypeMatch = (utilType) => (contextType) => {
        for (let methodName of Object.keys(typeDefs[utilType])) {
            const method = typeDefs[utilType][methodName];
            if (method.returns === contextType) {
                return methodName;
            }
        }
        return null;
    };
    const findStringUtilTypeMatch = findReturnTypeMatch("StringUtil");


    const wrapWithExpression = (node) => {
        const expr = dropDataTemplates.expression();
        expr.expression = node;
        return expr;
    };


    /**
     * @param {Object} dragData - The DragEvent data parsed into an object
     * @param {string} type - Data type
     * @returns {?Object.<string, *>} Returns either null or the ast node to be created from dropping this stringUtil
     */
    const stringUtilFromTypedContext = (dragData, contextType) => {
        const methodName = findStringUtilTypeMatch(contextType);
        if (methodName === null) return null;
        return dropDataTemplates.StringUtil(methodName, contextType);
    };


    const variableFromTypedContext = (dragData, contextType) => {
        const variableTypeMatchesContext = dragDataTypeMatchesContext(dragData, contextType);
        
        if (variableTypeMatchesContext) {
            return dropDataTemplates.variableValue(dragData.data);
        }

        const method = findReturnTypeMatch(dragData.data.type)(contextType);
        if (method == null) alert("Types don't match and no methods exist to match the type");
        
        return method !== null
            ? dropDataTemplates.typeUtil({name: dragData.data.type, method, returns: typeDefs[dragData.data.type][method].returns, variableName: dragData.data.name})
            : null;
    };

    const noNode = (dragData, contextType) => null;


    const dropContextMap = {
        // dragType
        variable: {
            // context name
            flow: (dragData, contextType) => wrapWithExpression(dropDataTemplates.variableExpression(dragData.data)),
            expression: (dragData, contextType) => dropDataTemplates.variableExpression(dragData.data),
            assignment: variableFromTypedContext,
            argument: variableFromTypedContext
        },
        StringUtil: {
            flow: (dragData, contextType) => wrapWithExpression(dropDataTemplates.StringUtil()),
            expression: (dragData, contextType) => dropDataTemplates.StringUtil(),
            assignment: stringUtilFromTypedContext,
            argument: stringUtilFromTypedContext
        },
        expression: {
            flow: (dragData, contextType) => dropDataTemplates.expression(),
            expression: noNode,
            assignment: noNode,
            argument: noNode
        },
        moveExpression: {
            flow: (dragData, contextType) => {
                dragData.node.id = v4();
                return dragData.node;
            },
            expression: (dragData, contextType) => dragData.node,
            assignment: noNode,
            argument: noNode
        }
    };

    /**
     * @callback stateChangeCallback
     * @param {Object.<string, *>} node - The ast node being created from the drop that occurred or null
     * if nothing should happen
     */
    /**
     * @callback dragEventHandler
     * @param {DragEvent} dragEvent The DragEvent passed from the original event handler
     */
    /**
     * @param {Object} dropConfig
     * @param {string} dropConfig.contextName The name of the component in which the drop event occurs. If I
     * drop in something into an assigment, the context would be 'assignment'. See the structure above
     * in 'drag_and_drop_handlers.js'
     * @param {string} [dropConfig.contextType] The data type of the context component
     * @param {stateChangeCallback} dropConfig.stateChangeCallback What gets called to modify state once the drop
     * has occurred and an ast node has been created and passed to this callback
     * @returns {dragEventHandler}
     */
    const flowDropHandler = ({ contextName, contextType, stateChangeCallback }) => (dragEvent) => {
        const dragData = getDragData(dragEvent);

        const node = dropContextMap[dragData.dragType][contextName](dragData, contextType);
        
        stateChangeCallback(node);
    };

    /* src/components/container_components/side_nav/FlowObjectSource.svelte generated by Svelte v3.46.4 */
    const file$f = "src/components/container_components/side_nav/FlowObjectSource.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let p;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			if (default_slot) default_slot.c();
    			add_location(p, file$f, 9, 4, 258);
    			attr_dev(div, "class", "side-nav-tile");
    			attr_dev(div, "draggable", "true");
    			add_location(div, file$f, 8, 0, 184);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);

    			if (default_slot) {
    				default_slot.m(p, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "dragstart", /*dragStart*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FlowObjectSource', slots, ['default']);
    	let { dragData } = $$props;
    	const dragStart = dragStartHandler(dragData);
    	const writable_props = ['dragData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FlowObjectSource> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('dragData' in $$props) $$invalidate(1, dragData = $$props.dragData);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ dragStartHandler, dragData, dragStart });

    	$$self.$inject_state = $$props => {
    		if ('dragData' in $$props) $$invalidate(1, dragData = $$props.dragData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dragStart, dragData, $$scope, slots];
    }

    class FlowObjectSource extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { dragData: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FlowObjectSource",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*dragData*/ ctx[1] === undefined && !('dragData' in props)) {
    			console.warn("<FlowObjectSource> was created without expected prop 'dragData'");
    		}
    	}

    	get dragData() {
    		throw new Error("<FlowObjectSource>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dragData(value) {
    		throw new Error("<FlowObjectSource>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const doActionDataDrag = () => ({ "dragType": "expression" });
    const stringUtilDataDrag = () => ({ "dragType": "StringUtil" });

    /**
     * Creates the drag start data for moving an ExpressionStatement within a flow
     * @param {Object.<string, *>} expressionNode The portion of the AST that represents the expression
     * and the subtree under it.
     * @returns {{ dragType: string, node: Object.<string, *> }}
     */
    const moveExpressionDrag = (expressionNode) => ({ "dragType": "moveExpression", "node": expressionNode });


    /**
     * @typedef {{ name: string, type: string, value: string|number }} VariableData
     */
    /**
     * Creates the drag start data for dragging a variable from a function info tab
     * @param {VariableData}
     * @returns {{ dragType: string, data: VariableData }}
     */
    const variableDrag = (variableData) => ({ "dragType": "variable", "data": variableData });

    /* src/components/container_components/side_nav/SideNav.svelte generated by Svelte v3.46.4 */
    const file$e = "src/components/container_components/side_nav/SideNav.svelte";

    // (8:8) <FlowObjectSource dragData={doActionDataDrag()}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Drag Me Tester");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(8:8) <FlowObjectSource dragData={doActionDataDrag()}>",
    		ctx
    	});

    	return block;
    }

    // (12:8) <FlowObjectSource dragData={stringUtilDataDrag()}>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("String Util");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(12:8) <FlowObjectSource dragData={stringUtilDataDrag()}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div2;
    	let div0;
    	let flowobjectsource0;
    	let t;
    	let div1;
    	let flowobjectsource1;
    	let current;

    	flowobjectsource0 = new FlowObjectSource({
    			props: {
    				dragData: doActionDataDrag(),
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	flowobjectsource1 = new FlowObjectSource({
    			props: {
    				dragData: stringUtilDataDrag(),
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(flowobjectsource0.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(flowobjectsource1.$$.fragment);
    			attr_dev(div0, "class", "project-structure-pane svelte-1jso9yl");
    			add_location(div0, file$e, 6, 4, 200);
    			attr_dev(div1, "class", "utility-pane svelte-1jso9yl");
    			add_location(div1, file$e, 10, 4, 343);
    			attr_dev(div2, "class", "side-nav-wrapper svelte-1jso9yl");
    			add_location(div2, file$e, 5, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(flowobjectsource0, div0, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			mount_component(flowobjectsource1, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const flowobjectsource0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				flowobjectsource0_changes.$$scope = { dirty, ctx };
    			}

    			flowobjectsource0.$set(flowobjectsource0_changes);
    			const flowobjectsource1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				flowobjectsource1_changes.$$scope = { dirty, ctx };
    			}

    			flowobjectsource1.$set(flowobjectsource1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flowobjectsource0.$$.fragment, local);
    			transition_in(flowobjectsource1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flowobjectsource0.$$.fragment, local);
    			transition_out(flowobjectsource1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(flowobjectsource0);
    			destroy_component(flowobjectsource1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideNav', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SideNav> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		FlowObjectSource,
    		doActionDataDrag,
    		stringUtilDataDrag
    	});

    	return [];
    }

    class SideNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNav",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src/components/FunctionInfoTab.svelte generated by Svelte v3.46.4 */
    const file$d = "src/components/FunctionInfoTab.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[14] = list;
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (56:4) {#if isDisplaying}
    function create_if_block$5(ctx) {
    	let div8;
    	let div5;
    	let h40;
    	let t1;
    	let div3;
    	let div0;
    	let t3;
    	let div1;
    	let t5;
    	let div2;
    	let t7;
    	let t8;
    	let div4;
    	let button0;
    	let t10;
    	let div7;
    	let h41;
    	let t12;
    	let t13;
    	let div6;
    	let button1;
    	let div8_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*info*/ ctx[0].variables;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*info*/ ctx[0].parameters;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div5 = element("div");
    			h40 = element("h4");
    			h40.textContent = "Variables";
    			t1 = space();
    			div3 = element("div");
    			div0 = element("div");
    			div0.textContent = "Name";
    			t3 = space();
    			div1 = element("div");
    			div1.textContent = "Type";
    			t5 = space();
    			div2 = element("div");
    			div2.textContent = "Default Value";
    			t7 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t8 = space();
    			div4 = element("div");
    			button0 = element("button");
    			button0.textContent = "Add Variable";
    			t10 = space();
    			div7 = element("div");
    			h41 = element("h4");
    			h41.textContent = "Parameters";
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t13 = space();
    			div6 = element("div");
    			button1 = element("button");
    			button1.textContent = "Add Variable";
    			add_location(h40, file$d, 58, 12, 1672);
    			attr_dev(div0, "class", "flex-1");
    			add_location(div0, file$d, 60, 16, 1771);
    			attr_dev(div1, "class", "flex-1");
    			add_location(div1, file$d, 61, 16, 1818);
    			attr_dev(div2, "class", "flex-1");
    			add_location(div2, file$d, 62, 16, 1865);
    			attr_dev(div3, "class", "flex w100 space-between var-container");
    			add_location(div3, file$d, 59, 12, 1703);
    			add_location(button0, file$d, 73, 16, 2527);
    			attr_dev(div4, "class", "add-var-btn");
    			add_location(div4, file$d, 72, 12, 2485);
    			attr_dev(div5, "class", "flex-1 var-section svelte-xmpv3d");
    			add_location(div5, file$d, 57, 8, 1627);
    			add_location(h41, file$d, 77, 12, 2669);
    			add_location(button1, file$d, 85, 16, 3125);
    			attr_dev(div6, "class", "add-var-btn");
    			add_location(div6, file$d, 84, 12, 3083);
    			attr_dev(div7, "class", "flex-1 param-section svelte-xmpv3d");
    			add_location(div7, file$d, 76, 8, 2622);
    			attr_dev(div8, "class", "flex tab-content svelte-xmpv3d");
    			add_location(div8, file$d, 56, 4, 1531);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div5);
    			append_dev(div5, h40);
    			append_dev(div5, t1);
    			append_dev(div5, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div5, t7);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div5, null);
    			}

    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, button0);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			append_dev(div7, h41);
    			append_dev(div7, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div7, null);
    			}

    			append_dev(div7, t13);
    			append_dev(div7, div6);
    			append_dev(div6, button1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*addVariable*/ ctx[4], false, false, false),
    					listen_dev(button1, "click", /*addParameter*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*dragStart, info*/ 9) {
    				each_value_1 = /*info*/ ctx[0].variables;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div5, t8);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*dragStart, info*/ 9) {
    				each_value = /*info*/ ctx[0].parameters;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div7, t13);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div8_transition) div8_transition = create_bidirectional_transition(div8, slide, { duration: 300, easing: quintOut }, true);
    				div8_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div8_transition) div8_transition = create_bidirectional_transition(div8, slide, { duration: 300, easing: quintOut }, false);
    			div8_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div8_transition) div8_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(56:4) {#if isDisplaying}",
    		ctx
    	});

    	return block;
    }

    // (66:12) {#each info.variables as variable, i}
    function create_each_block_1$2(ctx) {
    	let div3;
    	let div0;
    	let t0_value = /*variable*/ ctx[13].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let div1;
    	let select;
    	let option0;
    	let option1;
    	let select_value_value;
    	let t5;
    	let div2;
    	let input;
    	let mounted;
    	let dispose;

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[7].call(input, /*each_value_1*/ ctx[14], /*i*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			div1 = element("div");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "String";
    			option1 = element("option");
    			option1.textContent = "Integer";
    			t5 = space();
    			div2 = element("div");
    			input = element("input");
    			attr_dev(div0, "class", "var-name flex-1 svelte-xmpv3d");
    			attr_dev(div0, "draggable", "true");
    			add_location(div0, file$d, 67, 20, 2098);
    			option0.__value = "String";
    			option0.value = option0.__value;
    			add_location(option0, file$d, 68, 72, 2240);
    			option1.__value = "Integer";
    			option1.value = option1.__value;
    			add_location(option1, file$d, 68, 110, 2278);
    			add_location(select, file$d, 68, 40, 2208);
    			attr_dev(div1, "class", "flex-1");
    			add_location(div1, file$d, 68, 20, 2188);
    			attr_dev(input, "type", "text");
    			add_location(input, file$d, 69, 40, 2374);
    			attr_dev(div2, "class", "flex-1");
    			add_location(div2, file$d, 69, 20, 2354);
    			attr_dev(div3, "class", "flex w100 space-between var-container");
    			add_location(div3, file$d, 66, 16, 1991);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div1, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			select_option(select, /*variable*/ ctx[13].type);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, input);
    			set_input_value(input, /*variable*/ ctx[13].value);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", input_input_handler),
    					listen_dev(
    						div3,
    						"dragstart",
    						function () {
    							if (is_function(/*dragStart*/ ctx[3](/*variable*/ ctx[13]))) /*dragStart*/ ctx[3](/*variable*/ ctx[13]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*info*/ 1 && t0_value !== (t0_value = /*variable*/ ctx[13].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*info*/ 1 && select_value_value !== (select_value_value = /*variable*/ ctx[13].type)) {
    				select_option(select, /*variable*/ ctx[13].type);
    			}

    			if (dirty & /*info*/ 1 && input.value !== /*variable*/ ctx[13].value) {
    				set_input_value(input, /*variable*/ ctx[13].value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(66:12) {#each info.variables as variable, i}",
    		ctx
    	});

    	return block;
    }

    // (79:12) {#each info.parameters as parameter, i}
    function create_each_block$4(ctx) {
    	let div;
    	let span;
    	let t0_value = /*parameter*/ ctx[10].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let select;
    	let option0;
    	let option1;
    	let select_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "String";
    			option1 = element("option");
    			option1.textContent = "Integer";
    			add_location(span, file$d, 80, 16, 2863);
    			option0.__value = "String";
    			option0.value = option0.__value;
    			add_location(option0, file$d, 81, 49, 2944);
    			option1.__value = "Integer";
    			option1.value = option1.__value;
    			add_location(option1, file$d, 81, 87, 2982);
    			add_location(select, file$d, 81, 16, 2911);
    			attr_dev(div, "draggable", "true");
    			attr_dev(div, "class", "flex w100 space-between var-container");
    			add_location(div, file$d, 79, 12, 2753);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(div, t2);
    			append_dev(div, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			select_option(select, /*parameter*/ ctx[10].type);

    			if (!mounted) {
    				dispose = listen_dev(div, "dragstart", /*dragStart*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t0_value !== (t0_value = /*parameter*/ ctx[10].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*info*/ 1 && select_value_value !== (select_value_value = /*parameter*/ ctx[10].type)) {
    				select_option(select, /*parameter*/ ctx[10].type);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(79:12) {#each info.parameters as parameter, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div2;
    	let t0;
    	let div1;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*isDisplaying*/ ctx[1] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Function Info";
    			attr_dev(div0, "class", "tab-toggle svelte-xmpv3d");
    			toggle_class(div0, "isDisplaying", /*isDisplaying*/ ctx[1]);
    			add_location(div0, file$d, 93, 8, 3282);
    			attr_dev(div1, "class", "flex justify-center");
    			add_location(div1, file$d, 92, 4, 3240);
    			attr_dev(div2, "class", "absolute w100 tab-floater svelte-xmpv3d");
    			add_location(div2, file$d, 54, 0, 1438);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*tabToggle*/ ctx[2], false, false, false),
    					listen_dev(div2, "mouseenter", /*stopTimer*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isDisplaying*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isDisplaying*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*isDisplaying*/ 2) {
    				toggle_class(div0, "isDisplaying", /*isDisplaying*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FunctionInfoTab', slots, []);
    	let { info } = $$props;
    	let isDisplaying = false;
    	let reShowTimer = null;

    	function tabToggle(event) {
    		$$invalidate(1, isDisplaying = !isDisplaying);
    	}

    	/**
     * @param {DragEvent} event
     */
    	const dragStart = variableDragged => event => {
    		const dragData = variableDrag(variableDragged);
    		event.dataTransfer.setData('text/json', JSON.stringify(dragData));
    		$$invalidate(1, isDisplaying = false);
    	}; // Will auto-drop the menu after you've dropped a variable or parameter
    	// document.addEventListener('drop', functionInfoDrop, true);

    	function functionInfoDrop(event) {
    		$$invalidate(1, isDisplaying = true);
    		document.removeEventListener('drop', functionInfoDrop, true);
    		reShowTimer = setTimeout(tabToggle, 1200);
    	}

    	function addVariable(event) {
    		$$invalidate(
    			0,
    			info.variables = [
    				...info.variables,
    				{
    					"name": "newVar",
    					"type": "String",
    					"value": ""
    				}
    			],
    			info
    		);
    	}

    	function addParameter(event) {
    		$$invalidate(0, info.parameters = [...info.parameters, { "name": "newParam", "type": "String" }], info);
    	}

    	function stopTimer(event) {
    		if (reShowTimer) {
    			clearTimeout(reShowTimer);
    			reShowTimer = null;
    		}
    	}

    	const writable_props = ['info'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FunctionInfoTab> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler(each_value_1, i) {
    		each_value_1[i].value = this.value;
    		$$invalidate(0, info);
    	}

    	$$self.$$set = $$props => {
    		if ('info' in $$props) $$invalidate(0, info = $$props.info);
    	};

    	$$self.$capture_state = () => ({
    		slide,
    		quintOut,
    		variableDrag,
    		info,
    		isDisplaying,
    		reShowTimer,
    		tabToggle,
    		dragStart,
    		functionInfoDrop,
    		addVariable,
    		addParameter,
    		stopTimer
    	});

    	$$self.$inject_state = $$props => {
    		if ('info' in $$props) $$invalidate(0, info = $$props.info);
    		if ('isDisplaying' in $$props) $$invalidate(1, isDisplaying = $$props.isDisplaying);
    		if ('reShowTimer' in $$props) reShowTimer = $$props.reShowTimer;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		info,
    		isDisplaying,
    		tabToggle,
    		dragStart,
    		addVariable,
    		addParameter,
    		stopTimer,
    		input_input_handler
    	];
    }

    class FunctionInfoTab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { info: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FunctionInfoTab",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*info*/ ctx[0] === undefined && !('info' in props)) {
    			console.warn("<FunctionInfoTab> was created without expected prop 'info'");
    		}
    	}

    	get info() {
    		throw new Error("<FunctionInfoTab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<FunctionInfoTab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const mockData = {
        "main": {
            "info": {
                "variables": [
                    {
                        "name": "aStr",
                        "value": "",
                        "type": "String"
                    },
                    {
                        "name": "aNum",
                        "value": 0,
                        "type": "Integer"
                    }
                ],
                "parameters": [],
            },
            "body": [
                {
                    "type": "ExpressionStatement",
                    "id": v4(),
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "aStr",
                            "returns": "String"
                        },
                        "right": {
                            "type": "UtilityCallExpression",
                            "utilityName": "StringUtil",
                            "utilityMethod": "concat",
                            "arguments": [
                                {
                                    "type": "StringLiteral",
                                    "value": "A long string teehee",
                                    "returns": "String"
                                },
                                {
                                    "type": "Identifier",
                                    "name": "aStr",
                                    "returns": "String"
                                }
                            ],
                            "returns": "String"
                        }
                    }
                },
                {
                    "type": "ExpressionStatement",
                    "id": v4(),
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "aStr",
                            "returns": "String"
                        },
                        "right": {
                            "type": "UtilityCallExpression",
                            "variableName": "aStr",
                            "utilityName": "StringUtil",
                            "utilityMethod": "concat",
                            "arguments": [
                                {
                                    "type": "StringLiteral",
                                    "value": "A long string teehee",
                                    "returns": "String"
                                }
                            ],
                            "returns": "String"
                        }
                    }
                },
                {
                    "type": "ExpressionStatement",
                    "id": v4(),
                    "expression": {
                        "type": "AssignmentExpression",
                        "left": {
                            "type": "Identifier",
                            "name": "aNum",
                            "returns": "Integer"
                        },
                        "right": {
                            "type": "UtilityCallExpression",
                            "utilityName": "StringUtil",
                            "utilityMethod": "length",
                            "arguments": [
                                {
                                    "type": "StringLiteral",
                                    "value": "Counting the length of the string",
                                    "returns": "String"
                                }
                            ],
                            "returns": "Integer"
                        }
                    }
                },
                {
                    "type": "ExpressionStatement",
                    "id": v4(),
                    "expression": null
                },
                {
                    "type": "ExpressionStatement",
                    "id": v4(),
                    "expression": null
                },
                {
                    "type": "ExpressionStatement",
                    "id": v4(),
                    "expression": null
                },
                {
                    "type": "ExpressionStatement",
                    "id": v4(),
                    "expression": null
                },
                {
                    "type": "ExpressionStatement",
                    "id": v4(),
                    "expression": null
                },
                {
                    "type": "ExpressionStatement",
                    "id": v4(),
                    "expression": null
                },
                {
                    "type": "ExpressionStatement",
                    "id": v4(),
                    "expression": null
                },
                {
                    "type": "ExpressionStatement",
                    "id": v4(),
                    "expression": null
                },
                {
                    "type": "ExpressionStatement",
                    "id": v4(),
                    "expression": null
                },
                {
                    "type": "ExpressionStatement",
                    "id": v4(),
                    "expression": null
                },
                {
                    "type": "ExpressionStatement",
                    "id": v4(),
                    "expression": null
                }
            ]
        }
    };

    const ast = writable(
        mockData
    );

    /* src/components/ClearNodeProp.svelte generated by Svelte v3.46.4 */

    const file$c = "src/components/ClearNodeProp.svelte";

    function create_fragment$d(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Clear";
    			attr_dev(button, "class", "delete-btn");
    			add_location(button, file$c, 4, 0, 44);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onClick*/ ctx[0])) /*onClick*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ClearNodeProp', slots, []);
    	let { onClick } = $$props;
    	const writable_props = ['onClick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ClearNodeProp> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('onClick' in $$props) $$invalidate(0, onClick = $$props.onClick);
    	};

    	$$self.$capture_state = () => ({ onClick });

    	$$self.$inject_state = $$props => {
    		if ('onClick' in $$props) $$invalidate(0, onClick = $$props.onClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onClick];
    }

    class ClearNodeProp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { onClick: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClearNodeProp",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onClick*/ ctx[0] === undefined && !('onClick' in props)) {
    			console.warn("<ClearNodeProp> was created without expected prop 'onClick'");
    		}
    	}

    	get onClick() {
    		throw new Error("<ClearNodeProp>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<ClearNodeProp>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/DragHandle.svelte generated by Svelte v3.46.4 */

    const file$b = "src/components/DragHandle.svelte";

    function create_fragment$c(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "drag-handle svelte-1tyonyw");
    			attr_dev(div, "draggable", "true");
    			add_location(div, file$b, 1, 0, 1);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DragHandle', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DragHandle> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class DragHandle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DragHandle",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/components/flow_objects/ExpressionStatement.svelte generated by Svelte v3.46.4 */
    const file$a = "src/components/flow_objects/ExpressionStatement.svelte";

    // (90:12) {#if self.expression !== null}
    function create_if_block_1(ctx) {
    	let clearnodeprop;
    	let current;

    	clearnodeprop = new ClearNodeProp({
    			props: { onClick: /*func*/ ctx[13] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(clearnodeprop.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(clearnodeprop, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const clearnodeprop_changes = {};
    			if (dirty & /*parentRef, accessor*/ 3) clearnodeprop_changes.onClick = /*func*/ ctx[13];
    			clearnodeprop.$set(clearnodeprop_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(clearnodeprop.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(clearnodeprop.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(clearnodeprop, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(90:12) {#if self.expression !== null}",
    		ctx
    	});

    	return block;
    }

    // (102:8) {:else}
    function create_else_block$3(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Drag an action here";
    			attr_dev(p, "class", "dull-text");
    			add_location(p, file$a, 102, 12, 2843);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(102:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (96:8) {#if self && self.expression !== null}
    function create_if_block$4(ctx) {
    	let switch_instance;
    	let updating_parentRef;
    	let switch_instance_anchor;
    	let current;

    	function switch_instance_parentRef_binding(value) {
    		/*switch_instance_parentRef_binding*/ ctx[14](value);
    	}

    	var switch_value = constructors[/*self*/ ctx[4].expression.type];

    	function switch_props(ctx) {
    		let switch_instance_props = { accessor: "expression" };

    		if (/*parentRef*/ ctx[0][/*accessor*/ ctx[1]] !== void 0) {
    			switch_instance_props.parentRef = /*parentRef*/ ctx[0][/*accessor*/ ctx[1]];
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		binding_callbacks.push(() => bind(switch_instance, 'parentRef', switch_instance_parentRef_binding));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (!updating_parentRef && dirty & /*parentRef, accessor*/ 3) {
    				updating_parentRef = true;
    				switch_instance_changes.parentRef = /*parentRef*/ ctx[0][/*accessor*/ ctx[1]];
    				add_flush_callback(() => updating_parentRef = false);
    			}

    			if (switch_value !== (switch_value = constructors[/*self*/ ctx[4].expression.type])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					binding_callbacks.push(() => bind(switch_instance, 'parentRef', switch_instance_parentRef_binding));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(96:8) {#if self && self.expression !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div3;
    	let div1;
    	let draghandle;
    	let t0;
    	let div0;
    	let t1;
    	let button;
    	let t3;
    	let current_block_type_index;
    	let if_block1;
    	let t4;
    	let div2;
    	let current;
    	let mounted;
    	let dispose;
    	draghandle = new DragHandle({ $$inline: true });
    	let if_block0 = /*self*/ ctx[4].expression !== null && create_if_block_1(ctx);
    	const if_block_creators = [create_if_block$4, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*self*/ ctx[4] && /*self*/ ctx[4].expression !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			create_component(draghandle.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			button = element("button");
    			button.textContent = "Delete";
    			t3 = space();
    			if_block1.c();
    			t4 = space();
    			div2 = element("div");
    			add_location(button, file$a, 92, 12, 2502);
    			attr_dev(div0, "class", "flex w100");
    			add_location(div0, file$a, 88, 8, 2316);
    			attr_dev(div1, "class", "expression-container svelte-1sbi4ac");
    			add_location(div1, file$a, 80, 4, 1946);
    			attr_dev(div2, "class", "line-down-box svelte-1sbi4ac");
    			toggle_class(div2, "insert-drag-over", /*isOverInsertSpot*/ ctx[2]);
    			add_location(div2, file$a, 105, 4, 2917);
    			attr_dev(div3, "class", "svelte-1sbi4ac");
    			toggle_class(div3, "beingDragged", /*beingDragged*/ ctx[3]);
    			add_location(div3, file$a, 79, 0, 1917);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			mount_component(draghandle, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, button);
    			append_dev(div1, t3);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*deleteFlowStep*/ ctx[10], false, false, false),
    					listen_dev(div1, "dragover", prevent_default(dragOverHandler$1), false, true, false),
    					listen_dev(
    						div1,
    						"drop",
    						stop_propagation(prevent_default(flowDropHandler({
    							contextName: 'expression',
    							stateChangeCallback: /*dropModify*/ ctx[8]
    						}))),
    						false,
    						true,
    						true
    					),
    					listen_dev(div1, "dragstart", stop_propagation(/*handleDragStart*/ ctx[11]), false, false, true),
    					listen_dev(div1, "dragend", stop_propagation(/*checkDropCancel*/ ctx[12]), false, false, true),
    					listen_dev(div2, "dragover", prevent_default(insertDragOverHandler), false, true, false),
    					listen_dev(div2, "dragenter", prevent_default(/*insertDragEnter*/ ctx[5]), false, true, false),
    					listen_dev(div2, "dragleave", prevent_default(/*insertDragLeave*/ ctx[6]), false, true, false),
    					listen_dev(
    						div2,
    						"drop",
    						stop_propagation(prevent_default(flowDropHandler({
    							contextName: 'flow',
    							stateChangeCallback: /*insertDrop*/ ctx[9]
    						}))),
    						false,
    						true,
    						true
    					),
    					listen_dev(div2, "drop", stop_propagation(prevent_default(/*removeInsertHover*/ ctx[7])), false, true, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*self*/ ctx[4].expression !== null) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*self*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div1, null);
    			}

    			if (dirty & /*isOverInsertSpot*/ 4) {
    				toggle_class(div2, "insert-drag-over", /*isOverInsertSpot*/ ctx[2]);
    			}

    			if (dirty & /*beingDragged*/ 8) {
    				toggle_class(div3, "beingDragged", /*beingDragged*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(draghandle.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(draghandle.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(draghandle);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function dragOverHandler$1(event) {
    	
    } // do something like change cursor

    function insertDragOverHandler(event) {
    	
    } // something

    function instance$b($$self, $$props, $$invalidate) {
    	let self;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExpressionStatement', slots, []);
    	let { accessor } = $$props;
    	let { parentRef } = $$props;
    	let isOverInsertSpot = false;
    	let beingDragged = false;

    	function insertDragEnter(event) {
    		$$invalidate(2, isOverInsertSpot = true);
    	}

    	function insertDragLeave(event) {
    		$$invalidate(2, isOverInsertSpot = false);
    	}

    	function removeInsertHover(event) {
    		$$invalidate(2, isOverInsertSpot = false);
    	}

    	function dropModify(node) {
    		if (node.type === 'ExpressionStatement') $$invalidate(0, parentRef[accessor].expression = node.expression, parentRef); else $$invalidate(0, parentRef[accessor].expression = node, parentRef);
    	}

    	/**
     * @param {DragEvent} event
     */
    	function insertDrop(node) {
    		if (node === null) {
    			return;
    		}

    		parentRef.splice(accessor + 1, 0, node);
    		$$invalidate(0, parentRef = [...parentRef]);
    	}

    	function deleteFlowStep(_) {
    		parentRef.splice(accessor, 1);
    		$$invalidate(0, parentRef = [...parentRef]);
    	}

    	/**
     * @param {DragEvent} event
     */
    	function handleDragStart(event) {
    		const dragData = moveExpressionDrag(self);
    		event.dataTransfer.setData('text/json', JSON.stringify(dragData));
    		$$invalidate(3, beingDragged = true);
    	}

    	/** @param {DragEvent} event */
    	function checkDropCancel(event) {
    		if (event.dataTransfer.dropEffect === 'none') {
    			$$invalidate(3, beingDragged = false);
    			return;
    		}

    		deleteFlowStep();
    	}

    	const writable_props = ['accessor', 'parentRef'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExpressionStatement> was created with unknown prop '${key}'`);
    	});

    	const func = _ => $$invalidate(0, parentRef[accessor].expression = null, parentRef);

    	function switch_instance_parentRef_binding(value) {
    		if ($$self.$$.not_equal(parentRef[accessor], value)) {
    			parentRef[accessor] = value;
    			$$invalidate(0, parentRef);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('accessor' in $$props) $$invalidate(1, accessor = $$props.accessor);
    		if ('parentRef' in $$props) $$invalidate(0, parentRef = $$props.parentRef);
    	};

    	$$self.$capture_state = () => ({
    		flowDropHandler,
    		constructors,
    		ClearNodeProp,
    		DragHandle,
    		moveExpressionDrag,
    		accessor,
    		parentRef,
    		isOverInsertSpot,
    		beingDragged,
    		dragOverHandler: dragOverHandler$1,
    		insertDragOverHandler,
    		insertDragEnter,
    		insertDragLeave,
    		removeInsertHover,
    		dropModify,
    		insertDrop,
    		deleteFlowStep,
    		handleDragStart,
    		checkDropCancel,
    		self
    	});

    	$$self.$inject_state = $$props => {
    		if ('accessor' in $$props) $$invalidate(1, accessor = $$props.accessor);
    		if ('parentRef' in $$props) $$invalidate(0, parentRef = $$props.parentRef);
    		if ('isOverInsertSpot' in $$props) $$invalidate(2, isOverInsertSpot = $$props.isOverInsertSpot);
    		if ('beingDragged' in $$props) $$invalidate(3, beingDragged = $$props.beingDragged);
    		if ('self' in $$props) $$invalidate(4, self = $$props.self);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*parentRef, accessor*/ 3) {
    			$$invalidate(4, self = parentRef[accessor]);
    		}
    	};

    	return [
    		parentRef,
    		accessor,
    		isOverInsertSpot,
    		beingDragged,
    		self,
    		insertDragEnter,
    		insertDragLeave,
    		removeInsertHover,
    		dropModify,
    		insertDrop,
    		deleteFlowStep,
    		handleDragStart,
    		checkDropCancel,
    		func,
    		switch_instance_parentRef_binding
    	];
    }

    class ExpressionStatement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { accessor: 1, parentRef: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExpressionStatement",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*accessor*/ ctx[1] === undefined && !('accessor' in props)) {
    			console.warn("<ExpressionStatement> was created without expected prop 'accessor'");
    		}

    		if (/*parentRef*/ ctx[0] === undefined && !('parentRef' in props)) {
    			console.warn("<ExpressionStatement> was created without expected prop 'parentRef'");
    		}
    	}

    	get accessor() {
    		throw new Error("<ExpressionStatement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set accessor(value) {
    		throw new Error("<ExpressionStatement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parentRef() {
    		throw new Error("<ExpressionStatement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parentRef(value) {
    		throw new Error("<ExpressionStatement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/flow_objects/UtilityCallExpression.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1$1 } = globals;
    const file$9 = "src/components/flow_objects/UtilityCallExpression.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (41:8) {#each Object.keys(utilities).filter(matchParentTypeFilter) as method}
    function create_each_block_1$1(ctx) {
    	let option;
    	let t_value = /*method*/ ctx[15] + "";
    	let t;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*method*/ ctx[15];
    			option.value = option.__value;
    			option.selected = option_selected_value = /*method*/ ctx[15] === /*self*/ ctx[2].utilityMethod;
    			add_location(option, file$9, 41, 12, 1483);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*utilities*/ 8 && t_value !== (t_value = /*method*/ ctx[15] + "")) set_data_dev(t, t_value);

    			if (dirty & /*utilities*/ 8 && option_value_value !== (option_value_value = /*method*/ ctx[15])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty & /*utilities, self*/ 12 && option_selected_value !== (option_selected_value = /*method*/ ctx[15] === /*self*/ ctx[2].utilityMethod)) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(41:8) {#each Object.keys(utilities).filter(matchParentTypeFilter) as method}",
    		ctx
    	});

    	return block;
    }

    // (50:16) {:else}
    function create_else_block$2(ctx) {
    	let switch_instance;
    	let updating_parentRef;
    	let switch_instance_anchor;
    	let current;

    	function switch_instance_parentRef_binding(value) {
    		/*switch_instance_parentRef_binding*/ ctx[11](value);
    	}

    	var switch_value = constructors[/*argument*/ ctx[12].type];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			accessor: /*i*/ ctx[14],
    			isArgument: true
    		};

    		if (/*self*/ ctx[2].arguments !== void 0) {
    			switch_instance_props.parentRef = /*self*/ ctx[2].arguments;
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		binding_callbacks.push(() => bind(switch_instance, 'parentRef', switch_instance_parentRef_binding));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*self*/ 4) switch_instance_changes.accessor = /*i*/ ctx[14];

    			if (!updating_parentRef && dirty & /*self*/ 4) {
    				updating_parentRef = true;
    				switch_instance_changes.parentRef = /*self*/ ctx[2].arguments;
    				add_flush_callback(() => updating_parentRef = false);
    			}

    			if (switch_value !== (switch_value = constructors[/*argument*/ ctx[12].type])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					binding_callbacks.push(() => bind(switch_instance, 'parentRef', switch_instance_parentRef_binding));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(50:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:16) {#if argument.type === "UtilityCallExpression"}
    function create_if_block$3(ctx) {
    	let utilitycallexpression;
    	let updating_parentRef;
    	let current;

    	function utilitycallexpression_parentRef_binding(value) {
    		/*utilitycallexpression_parentRef_binding*/ ctx[10](value);
    	}

    	let utilitycallexpression_props = {
    		accessor: /*i*/ ctx[14],
    		filterType: /*argument*/ ctx[12].returns
    	};

    	if (/*self*/ ctx[2].arguments !== void 0) {
    		utilitycallexpression_props.parentRef = /*self*/ ctx[2].arguments;
    	}

    	utilitycallexpression = new UtilityCallExpression({
    			props: utilitycallexpression_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(utilitycallexpression, 'parentRef', utilitycallexpression_parentRef_binding));

    	const block = {
    		c: function create() {
    			create_component(utilitycallexpression.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(utilitycallexpression, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const utilitycallexpression_changes = {};
    			if (dirty & /*self*/ 4) utilitycallexpression_changes.accessor = /*i*/ ctx[14];
    			if (dirty & /*self*/ 4) utilitycallexpression_changes.filterType = /*argument*/ ctx[12].returns;

    			if (!updating_parentRef && dirty & /*self*/ 4) {
    				updating_parentRef = true;
    				utilitycallexpression_changes.parentRef = /*self*/ ctx[2].arguments;
    				add_flush_callback(() => updating_parentRef = false);
    			}

    			utilitycallexpression.$set(utilitycallexpression_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(utilitycallexpression.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(utilitycallexpression.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(utilitycallexpression, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(48:16) {#if argument.type === \\\"UtilityCallExpression\\\"}",
    		ctx
    	});

    	return block;
    }

    // (45:8) {#each self.arguments as argument, i (i)}
    function create_each_block$3(key_1, ctx) {
    	let div;
    	let clearnodeprop;
    	let t0;
    	let current_block_type_index;
    	let if_block;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;

    	function func(...args) {
    		return /*func*/ ctx[9](/*i*/ ctx[14], /*argument*/ ctx[12], ...args);
    	}

    	clearnodeprop = new ClearNodeProp({ props: { onClick: func }, $$inline: true });
    	const if_block_creators = [create_if_block$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*argument*/ ctx[12].type === "UtilityCallExpression") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(clearnodeprop.$$.fragment);
    			t0 = space();
    			if_block.c();
    			t1 = space();
    			attr_dev(div, "class", "arg-box svelte-48s71p");
    			add_location(div, file$9, 45, 12, 1664);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(clearnodeprop, div, null);
    			append_dev(div, t0);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div,
    						"drop",
    						stop_propagation(function () {
    							if (is_function(flowDropHandler({
    								contextName: 'argument',
    								contextType: /*argument*/ ctx[12].returns,
    								stateChangeCallback: /*addArgument*/ ctx[6](/*i*/ ctx[14])
    							}))) flowDropHandler({
    								contextName: 'argument',
    								contextType: /*argument*/ ctx[12].returns,
    								stateChangeCallback: /*addArgument*/ ctx[6](/*i*/ ctx[14])
    							}).apply(this, arguments);
    						}),
    						false,
    						false,
    						true
    					),
    					listen_dev(div, "dragover", dragover_handler$1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const clearnodeprop_changes = {};
    			if (dirty & /*parentRef, accessor, self*/ 7) clearnodeprop_changes.onClick = func;
    			clearnodeprop.$set(clearnodeprop_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, t1);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(clearnodeprop.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(clearnodeprop.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(clearnodeprop);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(45:8) {#each self.arguments as argument, i (i)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let p;
    	let span;

    	let t0_value = (/*self*/ ctx[2].variableName
    	? /*self*/ ctx[2].variableName
    	: /*self*/ ctx[2].utilityName) + "";

    	let t0;
    	let t1;
    	let select;
    	let t2;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = Object.keys(/*utilities*/ ctx[3]).filter(/*matchParentTypeFilter*/ ctx[5]);
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*self*/ ctx[2].arguments;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[14];
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = text(".");
    			select = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(select, file$9, 39, 69, 1354);
    			add_location(span, file$9, 39, 4, 1289);
    			set_style(p, "padding-left", "10px");
    			add_location(p, file$9, 38, 0, 1254);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, select);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select, null);
    			}

    			append_dev(p, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(p, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*onPropertyChange*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*self*/ 4) && t0_value !== (t0_value = (/*self*/ ctx[2].variableName
    			? /*self*/ ctx[2].variableName
    			: /*self*/ ctx[2].utilityName) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*Object, utilities, matchParentTypeFilter, self*/ 44) {
    				each_value_1 = Object.keys(/*utilities*/ ctx[3]).filter(/*matchParentTypeFilter*/ ctx[5]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*flowDropHandler, self, addArgument, constructors, parentRef, accessor, dropDataTemplates*/ 71) {
    				each_value = /*self*/ ctx[2].arguments;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each1_lookup, p, outro_and_destroy_block, create_each_block$3, null, get_each_context$3);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			destroy_each(each_blocks_1, detaching);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const dragover_handler$1 = () => {
    	
    };

    function instance$a($$self, $$props, $$invalidate) {
    	let self;
    	let utilities;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UtilityCallExpression', slots, []);
    	let { parentRef } = $$props;
    	let { accessor } = $$props;
    	let { filterType } = $$props;
    	let { isArgument } = $$props;

    	const onPropertyChange = event => {
    		const utilityMethod = event.target.value;
    		const util = utilities[utilityMethod];
    		util.args.map(argType => dropDataTemplates[argType + "Literal"]({}));
    		$$invalidate(0, parentRef[accessor] = dropDataTemplates[self.utilityName](utilityMethod), parentRef);
    	};

    	// !filterType is when things don't have a type in their parent context
    	const matchParentTypeFilter = methodName => !filterType || utilities[methodName].returns === filterType;

    	const addArgument = argIndex => node => {
    		if (node === null) return;
    		self.arguments.splice(argIndex, 1, node);
    		$$invalidate(0, parentRef[accessor].aruments = [...self.arguments], parentRef);
    	};

    	const writable_props = ['parentRef', 'accessor', 'filterType', 'isArgument'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UtilityCallExpression> was created with unknown prop '${key}'`);
    	});

    	const func = (i, argument, _) => $$invalidate(0, parentRef[accessor].arguments[i] = dropDataTemplates[argument.returns + "Literal"]({}), parentRef);

    	function utilitycallexpression_parentRef_binding(value) {
    		if ($$self.$$.not_equal(self.arguments, value)) {
    			self.arguments = value;
    			(($$invalidate(2, self), $$invalidate(0, parentRef)), $$invalidate(1, accessor));
    		}
    	}

    	function switch_instance_parentRef_binding(value) {
    		if ($$self.$$.not_equal(self.arguments, value)) {
    			self.arguments = value;
    			(($$invalidate(2, self), $$invalidate(0, parentRef)), $$invalidate(1, accessor));
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('parentRef' in $$props) $$invalidate(0, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(1, accessor = $$props.accessor);
    		if ('filterType' in $$props) $$invalidate(7, filterType = $$props.filterType);
    		if ('isArgument' in $$props) $$invalidate(8, isArgument = $$props.isArgument);
    	};

    	$$self.$capture_state = () => ({
    		flowDropHandler,
    		typeDefs,
    		ClearNodeProp,
    		constructors,
    		dropDataTemplates,
    		parentRef,
    		accessor,
    		filterType,
    		isArgument,
    		onPropertyChange,
    		matchParentTypeFilter,
    		addArgument,
    		self,
    		utilities
    	});

    	$$self.$inject_state = $$props => {
    		if ('parentRef' in $$props) $$invalidate(0, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(1, accessor = $$props.accessor);
    		if ('filterType' in $$props) $$invalidate(7, filterType = $$props.filterType);
    		if ('isArgument' in $$props) $$invalidate(8, isArgument = $$props.isArgument);
    		if ('self' in $$props) $$invalidate(2, self = $$props.self);
    		if ('utilities' in $$props) $$invalidate(3, utilities = $$props.utilities);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*parentRef, accessor*/ 3) {
    			$$invalidate(2, self = parentRef[accessor]);
    		}

    		if ($$self.$$.dirty & /*self*/ 4) {
    			$$invalidate(3, utilities = typeDefs[self.utilityName]);
    		}
    	};

    	return [
    		parentRef,
    		accessor,
    		self,
    		utilities,
    		onPropertyChange,
    		matchParentTypeFilter,
    		addArgument,
    		filterType,
    		isArgument,
    		func,
    		utilitycallexpression_parentRef_binding,
    		switch_instance_parentRef_binding
    	];
    }

    class UtilityCallExpression extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			parentRef: 0,
    			accessor: 1,
    			filterType: 7,
    			isArgument: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UtilityCallExpression",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*parentRef*/ ctx[0] === undefined && !('parentRef' in props)) {
    			console.warn("<UtilityCallExpression> was created without expected prop 'parentRef'");
    		}

    		if (/*accessor*/ ctx[1] === undefined && !('accessor' in props)) {
    			console.warn("<UtilityCallExpression> was created without expected prop 'accessor'");
    		}

    		if (/*filterType*/ ctx[7] === undefined && !('filterType' in props)) {
    			console.warn("<UtilityCallExpression> was created without expected prop 'filterType'");
    		}

    		if (/*isArgument*/ ctx[8] === undefined && !('isArgument' in props)) {
    			console.warn("<UtilityCallExpression> was created without expected prop 'isArgument'");
    		}
    	}

    	get parentRef() {
    		throw new Error("<UtilityCallExpression>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parentRef(value) {
    		throw new Error("<UtilityCallExpression>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get accessor() {
    		throw new Error("<UtilityCallExpression>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set accessor(value) {
    		throw new Error("<UtilityCallExpression>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterType() {
    		throw new Error("<UtilityCallExpression>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterType(value) {
    		throw new Error("<UtilityCallExpression>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isArgument() {
    		throw new Error("<UtilityCallExpression>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isArgument(value) {
    		throw new Error("<UtilityCallExpression>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/flow_objects/StringLiteral.svelte generated by Svelte v3.46.4 */

    const file$8 = "src/components/flow_objects/StringLiteral.svelte";

    function create_fragment$9(ctx) {
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			input.value = input_value_value = /*self*/ ctx[0].value;
    			add_location(input, file$8, 16, 0, 293);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*updateValue*/ ctx[1], false, false, false),
    					listen_dev(input, "dragStart", stop_propagation(dragStart_handler), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*self*/ 1 && input_value_value !== (input_value_value = /*self*/ ctx[0].value) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const dragStart_handler = () => {
    	
    };

    function instance$9($$self, $$props, $$invalidate) {
    	let self;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StringLiteral', slots, []);
    	let { parentRef } = $$props;
    	let { accessor } = $$props;
    	let { isArgument } = $$props;

    	function updateValue(event) {
    		$$invalidate(
    			2,
    			parentRef[accessor] = {
    				...parentRef[accessor],
    				value: event.target.value
    			},
    			parentRef
    		);
    	}

    	const writable_props = ['parentRef', 'accessor', 'isArgument'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StringLiteral> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('parentRef' in $$props) $$invalidate(2, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(3, accessor = $$props.accessor);
    		if ('isArgument' in $$props) $$invalidate(4, isArgument = $$props.isArgument);
    	};

    	$$self.$capture_state = () => ({
    		parentRef,
    		accessor,
    		isArgument,
    		updateValue,
    		self
    	});

    	$$self.$inject_state = $$props => {
    		if ('parentRef' in $$props) $$invalidate(2, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(3, accessor = $$props.accessor);
    		if ('isArgument' in $$props) $$invalidate(4, isArgument = $$props.isArgument);
    		if ('self' in $$props) $$invalidate(0, self = $$props.self);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*parentRef, accessor*/ 12) {
    			$$invalidate(0, self = parentRef[accessor]);
    		}
    	};

    	return [self, updateValue, parentRef, accessor, isArgument];
    }

    class StringLiteral extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { parentRef: 2, accessor: 3, isArgument: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StringLiteral",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*parentRef*/ ctx[2] === undefined && !('parentRef' in props)) {
    			console.warn("<StringLiteral> was created without expected prop 'parentRef'");
    		}

    		if (/*accessor*/ ctx[3] === undefined && !('accessor' in props)) {
    			console.warn("<StringLiteral> was created without expected prop 'accessor'");
    		}

    		if (/*isArgument*/ ctx[4] === undefined && !('isArgument' in props)) {
    			console.warn("<StringLiteral> was created without expected prop 'isArgument'");
    		}
    	}

    	get parentRef() {
    		throw new Error("<StringLiteral>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parentRef(value) {
    		throw new Error("<StringLiteral>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get accessor() {
    		throw new Error("<StringLiteral>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set accessor(value) {
    		throw new Error("<StringLiteral>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isArgument() {
    		throw new Error("<StringLiteral>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isArgument(value) {
    		throw new Error("<StringLiteral>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/flow_objects/CallExpression.svelte generated by Svelte v3.46.4 */
    const file$7 = "src/components/flow_objects/CallExpression.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (36:12) {:else}
    function create_else_block_1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = Array(/*utilityDef*/ ctx[1]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Array, utilityDef, self*/ 3) {
    				each_value_1 = Array(/*utilityDef*/ ctx[1]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(36:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:16) {#each Array(utilityDef) as i}
    function create_each_block_1(ctx) {
    	let div;
    	let stringliteral;
    	let updating_parentRef;
    	let current;

    	function stringliteral_parentRef_binding(value) {
    		/*stringliteral_parentRef_binding*/ ctx[8](value);
    	}

    	let stringliteral_props = {
    		accessor: /*i*/ ctx[11],
    		value: "",
    		isArgument: true
    	};

    	if (/*self*/ ctx[0].arguments !== void 0) {
    		stringliteral_props.parentRef = /*self*/ ctx[0].arguments;
    	}

    	stringliteral = new StringLiteral({
    			props: stringliteral_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(stringliteral, 'parentRef', stringliteral_parentRef_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(stringliteral.$$.fragment);
    			attr_dev(div, "class", "arg-box svelte-k9g395");
    			add_location(div, file$7, 37, 20, 1695);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(stringliteral, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stringliteral_changes = {};
    			if (dirty & /*utilityDef*/ 2) stringliteral_changes.accessor = /*i*/ ctx[11];

    			if (!updating_parentRef && dirty & /*self*/ 1) {
    				updating_parentRef = true;
    				stringliteral_changes.parentRef = /*self*/ ctx[0].arguments;
    				add_flush_callback(() => updating_parentRef = false);
    			}

    			stringliteral.$set(stringliteral_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stringliteral.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stringliteral.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(stringliteral);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(37:16) {#each Array(utilityDef) as i}",
    		ctx
    	});

    	return block;
    }

    // (32:20) {:else}
    function create_else_block$1(ctx) {
    	let switch_instance;
    	let updating_parentRef;
    	let switch_instance_anchor;
    	let current;

    	function switch_instance_parentRef_binding_1(value) {
    		/*switch_instance_parentRef_binding_1*/ ctx[7](value);
    	}

    	var switch_value = constructors[/*argument*/ ctx[9].type];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			accessor: /*i*/ ctx[11],
    			isArgument: true
    		};

    		if (/*self*/ ctx[0].arguments !== void 0) {
    			switch_instance_props.parentRef = /*self*/ ctx[0].arguments;
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		binding_callbacks.push(() => bind(switch_instance, 'parentRef', switch_instance_parentRef_binding_1));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*self*/ 1) switch_instance_changes.accessor = /*i*/ ctx[11];

    			if (!updating_parentRef && dirty & /*self*/ 1) {
    				updating_parentRef = true;
    				switch_instance_changes.parentRef = /*self*/ ctx[0].arguments;
    				add_flush_callback(() => updating_parentRef = false);
    			}

    			if (switch_value !== (switch_value = constructors[/*argument*/ ctx[9].type])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					binding_callbacks.push(() => bind(switch_instance, 'parentRef', switch_instance_parentRef_binding_1));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(32:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (30:20) {#if argument.type === "CallExpression"}
    function create_if_block$2(ctx) {
    	let callexpression;
    	let updating_parentRef;
    	let current;

    	function callexpression_parentRef_binding(value) {
    		/*callexpression_parentRef_binding*/ ctx[6](value);
    	}

    	let callexpression_props = { accessor: /*i*/ ctx[11] };

    	if (/*self*/ ctx[0].arguments !== void 0) {
    		callexpression_props.parentRef = /*self*/ ctx[0].arguments;
    	}

    	callexpression = new CallExpression({
    			props: callexpression_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(callexpression, 'parentRef', callexpression_parentRef_binding));

    	const block = {
    		c: function create() {
    			create_component(callexpression.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(callexpression, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const callexpression_changes = {};
    			if (dirty & /*self*/ 1) callexpression_changes.accessor = /*i*/ ctx[11];

    			if (!updating_parentRef && dirty & /*self*/ 1) {
    				updating_parentRef = true;
    				callexpression_changes.parentRef = /*self*/ ctx[0].arguments;
    				add_flush_callback(() => updating_parentRef = false);
    			}

    			callexpression.$set(callexpression_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(callexpression.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(callexpression.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(callexpression, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(30:20) {#if argument.type === \\\"CallExpression\\\"}",
    		ctx
    	});

    	return block;
    }

    // (28:12) {#each self.arguments as argument, i (i)}
    function create_each_block$2(key_1, ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*argument*/ ctx[9].type === "CallExpression") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "arg-box svelte-k9g395");
    			add_location(div, file$7, 28, 16, 1220);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(28:12) {#each self.arguments as argument, i (i)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let p;
    	let span;
    	let switch_instance;
    	let updating_parentRef;
    	let t0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t1;
    	let current;

    	function switch_instance_parentRef_binding(value) {
    		/*switch_instance_parentRef_binding*/ ctx[5](value);
    	}

    	var switch_value = constructors[/*self*/ ctx[0].callee.type];

    	function switch_props(ctx) {
    		let switch_instance_props = { isCallee: true, accessor: "callee" };

    		if (/*self*/ ctx[0] !== void 0) {
    			switch_instance_props.parentRef = /*self*/ ctx[0];
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		binding_callbacks.push(() => bind(switch_instance, 'parentRef', switch_instance_parentRef_binding));
    		switch_instance.$on("changeMethod", /*onMethodChange*/ ctx[2]);
    	}

    	let each_value = /*self*/ ctx[0].arguments;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[11];
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_1(ctx);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			span = element("span");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t0 = text("\n        (\n            ");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			t1 = text("\n        )");
    			add_location(span, file$7, 24, 4, 975);
    			set_style(p, "padding-left", "10px");
    			add_location(p, file$7, 23, 0, 940);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, span);

    			if (switch_instance) {
    				mount_component(switch_instance, span, null);
    			}

    			append_dev(span, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(span, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(span, null);
    			}

    			append_dev(span, t1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};

    			if (!updating_parentRef && dirty & /*self*/ 1) {
    				updating_parentRef = true;
    				switch_instance_changes.parentRef = /*self*/ ctx[0];
    				add_flush_callback(() => updating_parentRef = false);
    			}

    			if (switch_value !== (switch_value = constructors[/*self*/ ctx[0].callee.type])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					binding_callbacks.push(() => bind(switch_instance, 'parentRef', switch_instance_parentRef_binding));
    					switch_instance.$on("changeMethod", /*onMethodChange*/ ctx[2]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, span, t0);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (dirty & /*self, constructors, Array, utilityDef*/ 3) {
    				each_value = /*self*/ ctx[0].arguments;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, span, outro_and_destroy_block, create_each_block$2, t1, get_each_context$2);
    				check_outros();

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block_1(ctx);
    					each_1_else.c();
    					transition_in(each_1_else, 1);
    					each_1_else.m(span, t1);
    				} else if (each_1_else) {
    					group_outros();

    					transition_out(each_1_else, 1, 1, () => {
    						each_1_else = null;
    					});

    					check_outros();
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (switch_instance) destroy_component(switch_instance);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let self;
    	let utilityDef;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CallExpression', slots, []);
    	let { parentRef } = $$props;
    	let { accessor } = $$props;

    	//const store = useStore();
    	const onMethodChange = payloadObj => {
    		// TODO: commit change to the store using the parentRef from here
    		//store.commit('changeMethod', { refObj: parent.value, accessor: props.accessor, ...payloadObj });
    		$$invalidate(3, parentRef[accessor] = dropDataTemplates.StringUtil(payloadObj.detail.methodName), parentRef);
    	};

    	const writable_props = ['parentRef', 'accessor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CallExpression> was created with unknown prop '${key}'`);
    	});

    	function switch_instance_parentRef_binding(value) {
    		self = value;
    		(($$invalidate(0, self), $$invalidate(3, parentRef)), $$invalidate(4, accessor));
    	}

    	function callexpression_parentRef_binding(value) {
    		if ($$self.$$.not_equal(self.arguments, value)) {
    			self.arguments = value;
    			(($$invalidate(0, self), $$invalidate(3, parentRef)), $$invalidate(4, accessor));
    		}
    	}

    	function switch_instance_parentRef_binding_1(value) {
    		if ($$self.$$.not_equal(self.arguments, value)) {
    			self.arguments = value;
    			(($$invalidate(0, self), $$invalidate(3, parentRef)), $$invalidate(4, accessor));
    		}
    	}

    	function stringliteral_parentRef_binding(value) {
    		if ($$self.$$.not_equal(self.arguments, value)) {
    			self.arguments = value;
    			(($$invalidate(0, self), $$invalidate(3, parentRef)), $$invalidate(4, accessor));
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('parentRef' in $$props) $$invalidate(3, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(4, accessor = $$props.accessor);
    	};

    	$$self.$capture_state = () => ({
    		StringLiteral,
    		typeDefs,
    		dropDataTemplates,
    		constructors,
    		parentRef,
    		accessor,
    		onMethodChange,
    		self,
    		utilityDef
    	});

    	$$self.$inject_state = $$props => {
    		if ('parentRef' in $$props) $$invalidate(3, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(4, accessor = $$props.accessor);
    		if ('self' in $$props) $$invalidate(0, self = $$props.self);
    		if ('utilityDef' in $$props) $$invalidate(1, utilityDef = $$props.utilityDef);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*parentRef, accessor*/ 24) {
    			$$invalidate(0, self = parentRef[accessor]);
    		}

    		if ($$self.$$.dirty & /*self*/ 1) {
    			$$invalidate(1, utilityDef = self.callee.type === "MemberExpression"
    			? typeDefs[self.callee.object.name][self.callee.property.name].args
    			: 0);
    		}
    	};

    	return [
    		self,
    		utilityDef,
    		onMethodChange,
    		parentRef,
    		accessor,
    		switch_instance_parentRef_binding,
    		callexpression_parentRef_binding,
    		switch_instance_parentRef_binding_1,
    		stringliteral_parentRef_binding
    	];
    }

    class CallExpression extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { parentRef: 3, accessor: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CallExpression",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*parentRef*/ ctx[3] === undefined && !('parentRef' in props)) {
    			console.warn("<CallExpression> was created without expected prop 'parentRef'");
    		}

    		if (/*accessor*/ ctx[4] === undefined && !('accessor' in props)) {
    			console.warn("<CallExpression> was created without expected prop 'accessor'");
    		}
    	}

    	get parentRef() {
    		throw new Error("<CallExpression>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parentRef(value) {
    		throw new Error("<CallExpression>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get accessor() {
    		throw new Error("<CallExpression>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set accessor(value) {
    		throw new Error("<CallExpression>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/flow_objects/Identifier.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1 } = globals;
    const file$6 = "src/components/flow_objects/Identifier.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (36:0) {#if isArgument || usesTypeMethod}
    function create_if_block$1(ctx) {
    	let select;
    	let option;
    	let select_class_value;
    	let mounted;
    	let dispose;
    	let each_value = Object.keys(typeDefs[/*self*/ ctx[1].returns]).filter(/*typeMatches*/ ctx[3]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			option = element("option");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			option.selected = true;
    			option.__value = "";
    			option.value = option.__value;
    			add_location(option, file$6, 37, 8, 1094);
    			attr_dev(select, "class", select_class_value = "" + (null_to_empty(/*usesTypeMethod*/ ctx[2] ? '' : 'type-method-select') + " svelte-o897rk"));
    			add_location(select, file$6, 36, 4, 997);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*methodSelected*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Object, utilityDefinitions, self, typeMatches*/ 10) {
    				each_value = Object.keys(typeDefs[/*self*/ ctx[1].returns]).filter(/*typeMatches*/ ctx[3]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*usesTypeMethod*/ 4 && select_class_value !== (select_class_value = "" + (null_to_empty(/*usesTypeMethod*/ ctx[2] ? '' : 'type-method-select') + " svelte-o897rk"))) {
    				attr_dev(select, "class", select_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(36:0) {#if isArgument || usesTypeMethod}",
    		ctx
    	});

    	return block;
    }

    // (39:8) {#each Object.keys(utilityDefinitions[self.returns]).filter(typeMatches) as typeMethod}
    function create_each_block$1(ctx) {
    	let option;
    	let t_value = /*typeMethod*/ ctx[8] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*typeMethod*/ ctx[8];
    			option.value = option.__value;
    			add_location(option, file$6, 39, 12, 1229);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*self*/ 2 && t_value !== (t_value = /*typeMethod*/ ctx[8] + "")) set_data_dev(t, t_value);

    			if (dirty & /*self*/ 2 && option_value_value !== (option_value_value = /*typeMethod*/ ctx[8])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(39:8) {#each Object.keys(utilityDefinitions[self.returns]).filter(typeMatches) as typeMethod}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let span;
    	let t0_value = /*self*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let if_block = (/*isArgument*/ ctx[0] || /*usesTypeMethod*/ ctx[2]) && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(span, "class", "self svelte-o897rk");
    			add_location(span, file$6, 34, 0, 920);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*self*/ 2 && t0_value !== (t0_value = /*self*/ ctx[1].name + "")) set_data_dev(t0, t0_value);

    			if (/*isArgument*/ ctx[0] || /*usesTypeMethod*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let self;
    	let utilities;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Identifier', slots, []);
    	let { parentRef } = $$props;
    	let { accessor } = $$props;
    	let { isArgument = false } = $$props;
    	let usesTypeMethod = false;
    	const typeMatches = utilityKey => utilities[utilityKey].returns === self.returns;

    	function methodSelected(event) {
    		if (!event.target.value) {
    			$$invalidate(2, usesTypeMethod = false);
    			return;
    		}

    		const util = typeDefs[self.returns][event.target.value];

    		$$invalidate(
    			5,
    			parentRef[accessor] = dropDataTemplates.typeUtil({
    				name: self.returns,
    				method: event.target.value,
    				returns: util.returns,
    				variableName: self.name
    			}),
    			parentRef
    		);

    		$$invalidate(2, usesTypeMethod = true);
    	}

    	const writable_props = ['parentRef', 'accessor', 'isArgument'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Identifier> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('parentRef' in $$props) $$invalidate(5, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(6, accessor = $$props.accessor);
    		if ('isArgument' in $$props) $$invalidate(0, isArgument = $$props.isArgument);
    	};

    	$$self.$capture_state = () => ({
    		utilityDefinitions: typeDefs,
    		dropDataTemplates,
    		parentRef,
    		accessor,
    		isArgument,
    		usesTypeMethod,
    		typeMatches,
    		methodSelected,
    		self,
    		utilities
    	});

    	$$self.$inject_state = $$props => {
    		if ('parentRef' in $$props) $$invalidate(5, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(6, accessor = $$props.accessor);
    		if ('isArgument' in $$props) $$invalidate(0, isArgument = $$props.isArgument);
    		if ('usesTypeMethod' in $$props) $$invalidate(2, usesTypeMethod = $$props.usesTypeMethod);
    		if ('self' in $$props) $$invalidate(1, self = $$props.self);
    		if ('utilities' in $$props) utilities = $$props.utilities;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*parentRef, accessor*/ 96) {
    			$$invalidate(1, self = parentRef[accessor]);
    		}

    		if ($$self.$$.dirty & /*self*/ 2) {
    			utilities = typeDefs[self.returns];
    		}
    	};

    	return [
    		isArgument,
    		self,
    		usesTypeMethod,
    		typeMatches,
    		methodSelected,
    		parentRef,
    		accessor
    	];
    }

    class Identifier extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { parentRef: 5, accessor: 6, isArgument: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Identifier",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*parentRef*/ ctx[5] === undefined && !('parentRef' in props)) {
    			console.warn("<Identifier> was created without expected prop 'parentRef'");
    		}

    		if (/*accessor*/ ctx[6] === undefined && !('accessor' in props)) {
    			console.warn("<Identifier> was created without expected prop 'accessor'");
    		}
    	}

    	get parentRef() {
    		throw new Error("<Identifier>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parentRef(value) {
    		throw new Error("<Identifier>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get accessor() {
    		throw new Error("<Identifier>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set accessor(value) {
    		throw new Error("<Identifier>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isArgument() {
    		throw new Error("<Identifier>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isArgument(value) {
    		throw new Error("<Identifier>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/flow_objects/MemberExpression.svelte generated by Svelte v3.46.4 */
    const file$5 = "src/components/flow_objects/MemberExpression.svelte";

    function create_fragment$6(ctx) {
    	let span;
    	let switch_instance0;
    	let updating_parentRef;
    	let t;
    	let switch_instance1;
    	let updating_parentRef_1;
    	let current;

    	function switch_instance0_parentRef_binding(value) {
    		/*switch_instance0_parentRef_binding*/ ctx[4](value);
    	}

    	var switch_value = Identifier;

    	function switch_props(ctx) {
    		let switch_instance0_props = { accessor: "object", isObject: true };

    		if (/*self*/ ctx[1] !== void 0) {
    			switch_instance0_props.parentRef = /*self*/ ctx[1];
    		}

    		return {
    			props: switch_instance0_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance0 = new switch_value(switch_props(ctx));
    		binding_callbacks.push(() => bind(switch_instance0, 'parentRef', switch_instance0_parentRef_binding));
    	}

    	function switch_instance1_parentRef_binding(value) {
    		/*switch_instance1_parentRef_binding*/ ctx[5](value);
    	}

    	var switch_value_1 = Identifier;

    	function switch_props_1(ctx) {
    		let switch_instance1_props = {
    			accessor: "property",
    			isCalleeProperty: /*isCallee*/ ctx[0]
    		};

    		if (/*self*/ ctx[1] !== void 0) {
    			switch_instance1_props.parentRef = /*self*/ ctx[1];
    		}

    		return {
    			props: switch_instance1_props,
    			$$inline: true
    		};
    	}

    	if (switch_value_1) {
    		switch_instance1 = new switch_value_1(switch_props_1(ctx));
    		binding_callbacks.push(() => bind(switch_instance1, 'parentRef', switch_instance1_parentRef_binding));
    		switch_instance1.$on("changeMethod", /*changeMethod_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (switch_instance0) create_component(switch_instance0.$$.fragment);
    			t = text("\n    .\n    ");
    			if (switch_instance1) create_component(switch_instance1.$$.fragment);
    			add_location(span, file$5, 10, 0, 196);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (switch_instance0) {
    				mount_component(switch_instance0, span, null);
    			}

    			append_dev(span, t);

    			if (switch_instance1) {
    				mount_component(switch_instance1, span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance0_changes = {};

    			if (!updating_parentRef && dirty & /*self*/ 2) {
    				updating_parentRef = true;
    				switch_instance0_changes.parentRef = /*self*/ ctx[1];
    				add_flush_callback(() => updating_parentRef = false);
    			}

    			if (switch_value !== (switch_value = Identifier)) {
    				if (switch_instance0) {
    					group_outros();
    					const old_component = switch_instance0;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance0 = new switch_value(switch_props(ctx));
    					binding_callbacks.push(() => bind(switch_instance0, 'parentRef', switch_instance0_parentRef_binding));
    					create_component(switch_instance0.$$.fragment);
    					transition_in(switch_instance0.$$.fragment, 1);
    					mount_component(switch_instance0, span, t);
    				} else {
    					switch_instance0 = null;
    				}
    			} else if (switch_value) {
    				switch_instance0.$set(switch_instance0_changes);
    			}

    			const switch_instance1_changes = {};
    			if (dirty & /*isCallee*/ 1) switch_instance1_changes.isCalleeProperty = /*isCallee*/ ctx[0];

    			if (!updating_parentRef_1 && dirty & /*self*/ 2) {
    				updating_parentRef_1 = true;
    				switch_instance1_changes.parentRef = /*self*/ ctx[1];
    				add_flush_callback(() => updating_parentRef_1 = false);
    			}

    			if (switch_value_1 !== (switch_value_1 = Identifier)) {
    				if (switch_instance1) {
    					group_outros();
    					const old_component = switch_instance1;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value_1) {
    					switch_instance1 = new switch_value_1(switch_props_1(ctx));
    					binding_callbacks.push(() => bind(switch_instance1, 'parentRef', switch_instance1_parentRef_binding));
    					switch_instance1.$on("changeMethod", /*changeMethod_handler*/ ctx[6]);
    					create_component(switch_instance1.$$.fragment);
    					transition_in(switch_instance1.$$.fragment, 1);
    					mount_component(switch_instance1, span, null);
    				} else {
    					switch_instance1 = null;
    				}
    			} else if (switch_value_1) {
    				switch_instance1.$set(switch_instance1_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance0) transition_in(switch_instance0.$$.fragment, local);
    			if (switch_instance1) transition_in(switch_instance1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance0) transition_out(switch_instance0.$$.fragment, local);
    			if (switch_instance1) transition_out(switch_instance1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (switch_instance0) destroy_component(switch_instance0);
    			if (switch_instance1) destroy_component(switch_instance1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MemberExpression', slots, []);
    	let { parentRef } = $$props;
    	let { accessor } = $$props;
    	let { isCallee = false } = $$props;
    	let self = parentRef[accessor];
    	const writable_props = ['parentRef', 'accessor', 'isCallee'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MemberExpression> was created with unknown prop '${key}'`);
    	});

    	function switch_instance0_parentRef_binding(value) {
    		self = value;
    		$$invalidate(1, self);
    	}

    	function switch_instance1_parentRef_binding(value) {
    		self = value;
    		$$invalidate(1, self);
    	}

    	function changeMethod_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('parentRef' in $$props) $$invalidate(2, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(3, accessor = $$props.accessor);
    		if ('isCallee' in $$props) $$invalidate(0, isCallee = $$props.isCallee);
    	};

    	$$self.$capture_state = () => ({
    		Identifier,
    		parentRef,
    		accessor,
    		isCallee,
    		self
    	});

    	$$self.$inject_state = $$props => {
    		if ('parentRef' in $$props) $$invalidate(2, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(3, accessor = $$props.accessor);
    		if ('isCallee' in $$props) $$invalidate(0, isCallee = $$props.isCallee);
    		if ('self' in $$props) $$invalidate(1, self = $$props.self);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isCallee,
    		self,
    		parentRef,
    		accessor,
    		switch_instance0_parentRef_binding,
    		switch_instance1_parentRef_binding,
    		changeMethod_handler
    	];
    }

    class MemberExpression extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { parentRef: 2, accessor: 3, isCallee: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MemberExpression",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*parentRef*/ ctx[2] === undefined && !('parentRef' in props)) {
    			console.warn("<MemberExpression> was created without expected prop 'parentRef'");
    		}

    		if (/*accessor*/ ctx[3] === undefined && !('accessor' in props)) {
    			console.warn("<MemberExpression> was created without expected prop 'accessor'");
    		}
    	}

    	get parentRef() {
    		throw new Error("<MemberExpression>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parentRef(value) {
    		throw new Error("<MemberExpression>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get accessor() {
    		throw new Error("<MemberExpression>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set accessor(value) {
    		throw new Error("<MemberExpression>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCallee() {
    		throw new Error("<MemberExpression>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCallee(value) {
    		throw new Error("<MemberExpression>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/flow_objects/IntegerLiteral.svelte generated by Svelte v3.46.4 */

    const file$4 = "src/components/flow_objects/IntegerLiteral.svelte";

    function create_fragment$5(ctx) {
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			input.value = input_value_value = /*self*/ ctx[0].value;
    			add_location(input, file$4, 17, 0, 317);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*updateValue*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*self*/ 1 && input_value_value !== (input_value_value = /*self*/ ctx[0].value) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let self;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IntegerLiteral', slots, []);
    	let { parentRef } = $$props;
    	let { accessor } = $$props;

    	/**
     * @param {Event} event
     */
    	function updateValue(event) {
    		$$invalidate(
    			2,
    			parentRef[accessor] = {
    				...parentRef[accessor],
    				value: event.target.valueAsNumber
    			},
    			parentRef
    		);
    	}

    	const writable_props = ['parentRef', 'accessor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IntegerLiteral> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('parentRef' in $$props) $$invalidate(2, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(3, accessor = $$props.accessor);
    	};

    	$$self.$capture_state = () => ({ parentRef, accessor, updateValue, self });

    	$$self.$inject_state = $$props => {
    		if ('parentRef' in $$props) $$invalidate(2, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(3, accessor = $$props.accessor);
    		if ('self' in $$props) $$invalidate(0, self = $$props.self);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*parentRef, accessor*/ 12) {
    			$$invalidate(0, self = parentRef[accessor]);
    		}
    	};

    	return [self, updateValue, parentRef, accessor];
    }

    class IntegerLiteral extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { parentRef: 2, accessor: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IntegerLiteral",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*parentRef*/ ctx[2] === undefined && !('parentRef' in props)) {
    			console.warn("<IntegerLiteral> was created without expected prop 'parentRef'");
    		}

    		if (/*accessor*/ ctx[3] === undefined && !('accessor' in props)) {
    			console.warn("<IntegerLiteral> was created without expected prop 'accessor'");
    		}
    	}

    	get parentRef() {
    		throw new Error("<IntegerLiteral>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parentRef(value) {
    		throw new Error("<IntegerLiteral>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get accessor() {
    		throw new Error("<IntegerLiteral>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set accessor(value) {
    		throw new Error("<IntegerLiteral>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/flow_objects/AssignmentExpression.svelte generated by Svelte v3.46.4 */
    const file$3 = "src/components/flow_objects/AssignmentExpression.svelte";

    // (25:4) {:else}
    function create_else_block(ctx) {
    	let clearnodeprop;
    	let t;
    	let switch_instance;
    	let updating_parentRef;
    	let switch_instance_anchor;
    	let current;

    	clearnodeprop = new ClearNodeProp({
    			props: { onClick: /*func*/ ctx[4] },
    			$$inline: true
    		});

    	function switch_instance_parentRef_binding(value) {
    		/*switch_instance_parentRef_binding*/ ctx[5](value);
    	}

    	var switch_value = constructors[/*self*/ ctx[2].right.type];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			accessor: "right",
    			isArgument: true,
    			filterType: /*self*/ ctx[2].left.returns
    		};

    		if (/*self*/ ctx[2] !== void 0) {
    			switch_instance_props.parentRef = /*self*/ ctx[2];
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		binding_callbacks.push(() => bind(switch_instance, 'parentRef', switch_instance_parentRef_binding));
    	}

    	const block = {
    		c: function create() {
    			create_component(clearnodeprop.$$.fragment);
    			t = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(clearnodeprop, target, anchor);
    			insert_dev(target, t, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const clearnodeprop_changes = {};
    			if (dirty & /*parentRef, accessor*/ 3) clearnodeprop_changes.onClick = /*func*/ ctx[4];
    			clearnodeprop.$set(clearnodeprop_changes);
    			const switch_instance_changes = {};
    			if (dirty & /*self*/ 4) switch_instance_changes.filterType = /*self*/ ctx[2].left.returns;

    			if (!updating_parentRef && dirty & /*self*/ 4) {
    				updating_parentRef = true;
    				switch_instance_changes.parentRef = /*self*/ ctx[2];
    				add_flush_callback(() => updating_parentRef = false);
    			}

    			if (switch_value !== (switch_value = constructors[/*self*/ ctx[2].right.type])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					binding_callbacks.push(() => bind(switch_instance, 'parentRef', switch_instance_parentRef_binding));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(clearnodeprop.$$.fragment, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(clearnodeprop.$$.fragment, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(clearnodeprop, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(25:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:4) {#if self.right === null}
    function create_if_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Drag an expression here");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(23:4) {#if self.right === null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let p;
    	let t0;
    	let strong;
    	let t1_value = /*self*/ ctx[2].left.name + "";
    	let t1;
    	let t2;
    	let t3_value = /*self*/ ctx[2].left.returns + "";
    	let t3;
    	let t4;
    	let t5;
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*self*/ ctx[2].right === null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Assign ");
    			strong = element("strong");
    			t1 = text(t1_value);
    			t2 = text(": ");
    			t3 = text(t3_value);
    			t4 = text(" to");
    			t5 = space();
    			div = element("div");
    			if_block.c();
    			add_location(strong, file$3, 17, 10, 427);
    			add_location(p, file$3, 17, 0, 417);
    			attr_dev(div, "class", "assign-right-block svelte-v13rfq");
    			add_location(div, file$3, 18, 0, 489);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, strong);
    			append_dev(strong, t1);
    			append_dev(strong, t2);
    			append_dev(strong, t3);
    			append_dev(p, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "dragover", dragover_handler, false, false, false),
    					listen_dev(
    						div,
    						"drop",
    						stop_propagation(function () {
    							if (is_function(flowDropHandler({
    								contextName: 'assignment',
    								contextType: /*self*/ ctx[2].left.returns,
    								stateChangeCallback: /*stateChangeOnDrop*/ ctx[3]
    							}))) flowDropHandler({
    								contextName: 'assignment',
    								contextType: /*self*/ ctx[2].left.returns,
    								stateChangeCallback: /*stateChangeOnDrop*/ ctx[3]
    							}).apply(this, arguments);
    						}),
    						false,
    						false,
    						true
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*self*/ 4) && t1_value !== (t1_value = /*self*/ ctx[2].left.name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*self*/ 4) && t3_value !== (t3_value = /*self*/ ctx[2].left.returns + "")) set_data_dev(t3, t3_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const dragover_handler = () => {
    	
    };

    function instance$4($$self, $$props, $$invalidate) {
    	let self;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AssignmentExpression', slots, []);
    	let { parentRef } = $$props;
    	let { accessor } = $$props;

    	const stateChangeOnDrop = node => {
    		if (node === null) return;
    		$$invalidate(0, parentRef[accessor].right = node, parentRef);
    	};

    	const writable_props = ['parentRef', 'accessor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AssignmentExpression> was created with unknown prop '${key}'`);
    	});

    	const func = _ => $$invalidate(0, parentRef[accessor].right = null, parentRef);

    	function switch_instance_parentRef_binding(value) {
    		self = value;
    		(($$invalidate(2, self), $$invalidate(0, parentRef)), $$invalidate(1, accessor));
    	}

    	$$self.$$set = $$props => {
    		if ('parentRef' in $$props) $$invalidate(0, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(1, accessor = $$props.accessor);
    	};

    	$$self.$capture_state = () => ({
    		constructors,
    		flowDropHandler,
    		ClearNodeProp,
    		parentRef,
    		accessor,
    		stateChangeOnDrop,
    		self
    	});

    	$$self.$inject_state = $$props => {
    		if ('parentRef' in $$props) $$invalidate(0, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(1, accessor = $$props.accessor);
    		if ('self' in $$props) $$invalidate(2, self = $$props.self);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*parentRef, accessor*/ 3) {
    			$$invalidate(2, self = parentRef[accessor]);
    		}
    	};

    	return [
    		parentRef,
    		accessor,
    		self,
    		stateChangeOnDrop,
    		func,
    		switch_instance_parentRef_binding
    	];
    }

    class AssignmentExpression extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { parentRef: 0, accessor: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AssignmentExpression",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*parentRef*/ ctx[0] === undefined && !('parentRef' in props)) {
    			console.warn("<AssignmentExpression> was created without expected prop 'parentRef'");
    		}

    		if (/*accessor*/ ctx[1] === undefined && !('accessor' in props)) {
    			console.warn("<AssignmentExpression> was created without expected prop 'accessor'");
    		}
    	}

    	get parentRef() {
    		throw new Error("<AssignmentExpression>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parentRef(value) {
    		throw new Error("<AssignmentExpression>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get accessor() {
    		throw new Error("<AssignmentExpression>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set accessor(value) {
    		throw new Error("<AssignmentExpression>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // Constructors to use in <svelte:component> tags, keyed by the 'type' from the AST
    const constructors = {
        "ExpressionStatement": ExpressionStatement,
        "UtilityCallExpression": UtilityCallExpression,
        "CallExpression": CallExpression,
        "Identifier": Identifier,
        "MemberExpression": MemberExpression,
        "StringLiteral": StringLiteral,
        "IntegerLiteral": IntegerLiteral,
        "AssignmentExpression": AssignmentExpression
    };

    function squish(node, params) {
        const { opacity = 0, start = 0 } = params;

        return {
            delay: params.delay || 0,
            duration: params.duration || 400,
            easing: params.easing || cubicOut,
            css(t, _) {
                const o = t * (1 - opacity) + opacity;
                const s = t * (1 - start) + start;
                return `
                transform: scaleY(${s});
                opacity: ${o};
            `;
            }
        };
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* src/components/container_components/AppWindow.svelte generated by Svelte v3.46.4 */
    const file$2 = "src/components/container_components/AppWindow.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (29:8) {#each $ast.main.body as flowObject, i (flowObject.id)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let switch_instance;
    	let updating_parentRef;
    	let t;
    	let div_transition;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	function switch_instance_parentRef_binding(value) {
    		/*switch_instance_parentRef_binding*/ ctx[3](value);
    	}

    	var switch_value = constructors[/*flowObject*/ ctx[4].type];

    	function switch_props(ctx) {
    		let switch_instance_props = { accessor: /*i*/ ctx[6] };

    		if (/*$ast*/ ctx[0].main.body !== void 0) {
    			switch_instance_props.parentRef = /*$ast*/ ctx[0].main.body;
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		binding_callbacks.push(() => bind(switch_instance, 'parentRef', switch_instance_parentRef_binding));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			add_location(div, file$2, 29, 12, 945);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const switch_instance_changes = {};
    			if (dirty & /*$ast*/ 1) switch_instance_changes.accessor = /*i*/ ctx[6];

    			if (!updating_parentRef && dirty & /*$ast*/ 1) {
    				updating_parentRef = true;
    				switch_instance_changes.parentRef = /*$ast*/ ctx[0].main.body;
    				add_flush_callback(() => updating_parentRef = false);
    			}

    			if (switch_value !== (switch_value = constructors[/*flowObject*/ ctx[4].type])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					binding_callbacks.push(() => bind(switch_instance, 'parentRef', switch_instance_parentRef_binding));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, t);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		r: function measure() {
    			rect = div.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div);
    			stop_animation();
    			add_transform(div, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div, rect, flip, { duration: 400 });
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			if (local) {
    				add_render_callback(() => {
    					if (!div_transition) div_transition = create_bidirectional_transition(div, squish, { duration: 300, opacity: 0.4, start: 0.2 }, true);
    					div_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);

    			if (local) {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, squish, { duration: 300, opacity: 0.4, start: 0.2 }, false);
    				div_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(29:8) {#each $ast.main.body as flowObject, i (flowObject.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let functioninfotab;
    	let updating_info;
    	let t;
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let mounted;
    	let dispose;

    	function functioninfotab_info_binding(value) {
    		/*functioninfotab_info_binding*/ ctx[2](value);
    	}

    	let functioninfotab_props = {};

    	if (/*$ast*/ ctx[0].main.info !== void 0) {
    		functioninfotab_props.info = /*$ast*/ ctx[0].main.info;
    	}

    	functioninfotab = new FunctionInfoTab({
    			props: functioninfotab_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(functioninfotab, 'info', functioninfotab_info_binding));
    	let each_value = /*$ast*/ ctx[0].main.body;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*flowObject*/ ctx[4].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(functioninfotab.$$.fragment);
    			t = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "flow-wrapper svelte-gp4s69");
    			add_location(div0, file$2, 27, 4, 842);
    			attr_dev(div1, "class", "app-window-wrapper svelte-gp4s69");
    			add_location(div1, file$2, 20, 0, 593);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(functioninfotab, div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "dragover", prevent_default(dragOverHandler), false, true, false),
    					listen_dev(
    						div1,
    						"drop",
    						stop_propagation(prevent_default(flowDropHandler({
    							contextName: 'flow',
    							stateChangeCallback: /*appendDrop*/ ctx[1]
    						}))),
    						false,
    						true,
    						true
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const functioninfotab_changes = {};

    			if (!updating_info && dirty & /*$ast*/ 1) {
    				updating_info = true;
    				functioninfotab_changes.info = /*$ast*/ ctx[0].main.info;
    				add_flush_callback(() => updating_info = false);
    			}

    			functioninfotab.$set(functioninfotab_changes);

    			if (dirty & /*constructors, $ast*/ 1) {
    				each_value = /*$ast*/ ctx[0].main.body;
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, fix_and_outro_and_destroy_block, create_each_block, null, get_each_context);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(functioninfotab.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(functioninfotab.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(functioninfotab);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function dragOverHandler(event) {
    	
    } // do stuff like change the cursor

    function instance$3($$self, $$props, $$invalidate) {
    	let $ast;
    	validate_store(ast, 'ast');
    	component_subscribe($$self, ast, $$value => $$invalidate(0, $ast = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AppWindow', slots, []);

    	const appendDrop = node => {
    		set_store_value(ast, $ast.main.body = [...$ast.main.body, node], $ast);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AppWindow> was created with unknown prop '${key}'`);
    	});

    	function functioninfotab_info_binding(value) {
    		if ($$self.$$.not_equal($ast.main.info, value)) {
    			$ast.main.info = value;
    			ast.set($ast);
    		}
    	}

    	function switch_instance_parentRef_binding(value) {
    		if ($$self.$$.not_equal($ast.main.body, value)) {
    			$ast.main.body = value;
    			ast.set($ast);
    		}
    	}

    	$$self.$capture_state = () => ({
    		FunctionInfoTab,
    		flowDropHandler,
    		ast,
    		constructors,
    		squish,
    		flip,
    		dragOverHandler,
    		appendDrop,
    		$ast
    	});

    	return [
    		$ast,
    		appendDrop,
    		functioninfotab_info_binding,
    		switch_instance_parentRef_binding
    	];
    }

    class AppWindow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AppWindow",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/container_components/AppWrapper.svelte generated by Svelte v3.46.4 */
    const file$1 = "src/components/container_components/AppWrapper.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let sidenav;
    	let t;
    	let appwindow;
    	let current;
    	sidenav = new SideNav({ $$inline: true });
    	appwindow = new AppWindow({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(sidenav.$$.fragment);
    			t = space();
    			create_component(appwindow.$$.fragment);
    			attr_dev(div, "class", "content-wrapper svelte-k41ti0");
    			add_location(div, file$1, 5, 0, 125);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(sidenav, div, null);
    			append_dev(div, t);
    			mount_component(appwindow, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidenav.$$.fragment, local);
    			transition_in(appwindow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidenav.$$.fragment, local);
    			transition_out(appwindow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(sidenav);
    			destroy_component(appwindow);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AppWrapper', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AppWrapper> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SideNav, AppWindow });
    	return [];
    }

    class AppWrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AppWrapper",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/Header.svelte generated by Svelte v3.46.4 */

    const file = "src/components/Header.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = `${headerText}`;
    			add_location(h1, file, 5, 4, 78);
    			attr_dev(div, "class", "header svelte-1w1jjle");
    			add_location(div, file, 4, 0, 53);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const headerText = "Z-Flow";

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ headerText });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */

    function create_fragment(ctx) {
    	let header;
    	let t;
    	let appwrapper;
    	let current;
    	header = new Header({ $$inline: true });
    	appwrapper = new AppWrapper({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t = space();
    			create_component(appwrapper.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(appwrapper, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(appwrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(appwrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(appwrapper, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ AppWrapper, Header });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
    	target: document.querySelector("#app")
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
