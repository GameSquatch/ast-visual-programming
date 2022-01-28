
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
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
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.2' }, detail), true));
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

    var dropDataTemplates = {
        "stringUtil": (method = "concat") => ({
            type: "UtilityCallExpression",
            utilityName: "StringUtil",
            utilityMethod: method,
            arguments: []
        }),
        "expressionStatement": () => ({
            type: "ExpressionStatement",
            expression: null
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

    const dropModifyObjectHandler = (event) => {
        const dragData = getDragData(event);
        const replacingNode = dropDataTemplates[dragData.type]();

        return replacingNode;
    };


    const dropInsertAstCreation = (event) => {
        const dragData = getDragData(event);
        const expressionStatement = dropDataTemplates.expressionStatement();

        // Since we are creating a new object in a flow, we need to make sure that
        // we wrap the node we are creating in an Expression Statement
        if (dragData.type !== 'expressionStatement') {
            expressionStatement.expression = dropDataTemplates[dragData.type]();
        }

        return expressionStatement;
    };

    /* src/components/container_components/side_nav/FlowObjectSource.svelte generated by Svelte v3.46.2 */
    const file$b = "src/components/container_components/side_nav/FlowObjectSource.svelte";

    function create_fragment$c(ctx) {
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
    			add_location(p, file$b, 9, 4, 258);
    			attr_dev(div, "class", "side-nav-tile");
    			attr_dev(div, "draggable", "true");
    			add_location(div, file$b, 8, 0, 184);
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { dragData: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FlowObjectSource",
    			options,
    			id: create_fragment$c.name
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

    /* src/components/container_components/side_nav/SideNav.svelte generated by Svelte v3.46.2 */
    const file$a = "src/components/container_components/side_nav/SideNav.svelte";

    // (15:8) <FlowObjectSource dragData={doActionData}>
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
    		source: "(15:8) <FlowObjectSource dragData={doActionData}>",
    		ctx
    	});

    	return block;
    }

    // (19:8) <FlowObjectSource dragData={stringUtilData}>
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
    		source: "(19:8) <FlowObjectSource dragData={stringUtilData}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div2;
    	let div0;
    	let flowobjectsource0;
    	let t;
    	let div1;
    	let flowobjectsource1;
    	let current;

    	flowobjectsource0 = new FlowObjectSource({
    			props: {
    				dragData: /*doActionData*/ ctx[0],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	flowobjectsource1 = new FlowObjectSource({
    			props: {
    				dragData: /*stringUtilData*/ ctx[1],
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
    			add_location(div0, file$a, 13, 4, 259);
    			attr_dev(div1, "class", "utility-pane svelte-1jso9yl");
    			add_location(div1, file$a, 17, 4, 396);
    			attr_dev(div2, "class", "side-nav-wrapper svelte-1jso9yl");
    			add_location(div2, file$a, 12, 0, 224);
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

    			if (dirty & /*$$scope*/ 4) {
    				flowobjectsource0_changes.$$scope = { dirty, ctx };
    			}

    			flowobjectsource0.$set(flowobjectsource0_changes);
    			const flowobjectsource1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideNav', slots, []);
    	const doActionData = { type: "expressionStatement" };
    	const stringUtilData = { type: "stringUtil" };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SideNav> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		FlowObjectSource,
    		doActionData,
    		stringUtilData
    	});

    	return [doActionData, stringUtilData];
    }

    class SideNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNav",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/components/flow_objects/Identifier.svelte generated by Svelte v3.46.2 */

    const { Object: Object_1$1 } = globals;
    const file$9 = "src/components/flow_objects/Identifier.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (23:0) {:else}
    function create_else_block$4(ctx) {
    	let select;
    	let mounted;
    	let dispose;
    	let each_value = Object.getOwnPropertyNames(String.prototype);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(select, file$9, 23, 4, 525);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*onPropertyChange*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Object, String, self*/ 2) {
    				each_value = Object.getOwnPropertyNames(String.prototype);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
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
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(23:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#if !isCalleeProperty}
    function create_if_block$5(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = `${/*self*/ ctx[1].name}`;
    			add_location(span, file$9, 21, 4, 488);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(21:0) {#if !isCalleeProperty}",
    		ctx
    	});

    	return block;
    }

    // (25:8) {#each Object.getOwnPropertyNames(String.prototype) as method}
    function create_each_block$3(ctx) {
    	let option;
    	let t_value = /*method*/ ctx[8] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*method*/ ctx[8];
    			option.value = option.__value;
    			option.selected = /*method*/ ctx[8] === /*self*/ ctx[1].name;
    			add_location(option, file$9, 25, 12, 646);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(25:8) {#each Object.getOwnPropertyNames(String.prototype) as method}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (!/*isCalleeProperty*/ ctx[0]) return create_if_block$5;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Identifier', slots, []);
    	let { parentRef } = $$props;
    	let { accessor } = $$props;
    	let { isObject = false } = $$props;
    	let { isCallee = false } = $$props;
    	let { isCalleeProperty = false } = $$props;
    	let self = parentRef[accessor];
    	let dispatch = createEventDispatcher();

    	const onPropertyChange = event => {
    		dispatch('changeMethod', { methodName: event.target.value });
    	};

    	const writable_props = ['parentRef', 'accessor', 'isObject', 'isCallee', 'isCalleeProperty'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Identifier> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('parentRef' in $$props) $$invalidate(3, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(4, accessor = $$props.accessor);
    		if ('isObject' in $$props) $$invalidate(5, isObject = $$props.isObject);
    		if ('isCallee' in $$props) $$invalidate(6, isCallee = $$props.isCallee);
    		if ('isCalleeProperty' in $$props) $$invalidate(0, isCalleeProperty = $$props.isCalleeProperty);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		parentRef,
    		accessor,
    		isObject,
    		isCallee,
    		isCalleeProperty,
    		self,
    		dispatch,
    		onPropertyChange
    	});

    	$$self.$inject_state = $$props => {
    		if ('parentRef' in $$props) $$invalidate(3, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(4, accessor = $$props.accessor);
    		if ('isObject' in $$props) $$invalidate(5, isObject = $$props.isObject);
    		if ('isCallee' in $$props) $$invalidate(6, isCallee = $$props.isCallee);
    		if ('isCalleeProperty' in $$props) $$invalidate(0, isCalleeProperty = $$props.isCalleeProperty);
    		if ('self' in $$props) $$invalidate(1, self = $$props.self);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isCalleeProperty,
    		self,
    		onPropertyChange,
    		parentRef,
    		accessor,
    		isObject,
    		isCallee
    	];
    }

    class Identifier extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			parentRef: 3,
    			accessor: 4,
    			isObject: 5,
    			isCallee: 6,
    			isCalleeProperty: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Identifier",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*parentRef*/ ctx[3] === undefined && !('parentRef' in props)) {
    			console.warn("<Identifier> was created without expected prop 'parentRef'");
    		}

    		if (/*accessor*/ ctx[4] === undefined && !('accessor' in props)) {
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

    	get isObject() {
    		throw new Error("<Identifier>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isObject(value) {
    		throw new Error("<Identifier>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCallee() {
    		throw new Error("<Identifier>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCallee(value) {
    		throw new Error("<Identifier>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCalleeProperty() {
    		throw new Error("<Identifier>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCalleeProperty(value) {
    		throw new Error("<Identifier>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/flow_objects/MemberExpression.svelte generated by Svelte v3.46.2 */
    const file$8 = "src/components/flow_objects/MemberExpression.svelte";

    function create_fragment$9(ctx) {
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
    			add_location(span, file$8, 10, 0, 196);
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { parentRef: 2, accessor: 3, isCallee: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MemberExpression",
    			options,
    			id: create_fragment$9.name
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

    /* src/components/flow_objects/StringLiteral.svelte generated by Svelte v3.46.2 */

    const file$7 = "src/components/flow_objects/StringLiteral.svelte";

    // (11:0) {:else}
    function create_else_block$3(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = `"${/*self*/ ctx[1]?.value ?? ""}"`;
    			add_location(span, file$7, 11, 4, 212);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(11:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:0) {#if isArgument}
    function create_if_block$4(ctx) {
    	let input;

    	const block = {
    		c: function create() {
    			input = element("input");
    			input.value = /*self*/ ctx[1]?.value ?? "";
    			add_location(input, file$7, 9, 4, 164);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(9:0) {#if isArgument}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*isArgument*/ ctx[0]) return create_if_block$4;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StringLiteral', slots, []);
    	let { parentRef } = $$props;
    	let { accessor } = $$props;
    	let { isArgument = false } = $$props;
    	let self = parentRef[accessor];
    	const writable_props = ['parentRef', 'accessor', 'isArgument'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StringLiteral> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('parentRef' in $$props) $$invalidate(2, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(3, accessor = $$props.accessor);
    		if ('isArgument' in $$props) $$invalidate(0, isArgument = $$props.isArgument);
    	};

    	$$self.$capture_state = () => ({ parentRef, accessor, isArgument, self });

    	$$self.$inject_state = $$props => {
    		if ('parentRef' in $$props) $$invalidate(2, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(3, accessor = $$props.accessor);
    		if ('isArgument' in $$props) $$invalidate(0, isArgument = $$props.isArgument);
    		if ('self' in $$props) $$invalidate(1, self = $$props.self);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isArgument, self, parentRef, accessor];
    }

    class StringLiteral extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { parentRef: 2, accessor: 3, isArgument: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StringLiteral",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*parentRef*/ ctx[2] === undefined && !('parentRef' in props)) {
    			console.warn("<StringLiteral> was created without expected prop 'parentRef'");
    		}

    		if (/*accessor*/ ctx[3] === undefined && !('accessor' in props)) {
    			console.warn("<StringLiteral> was created without expected prop 'accessor'");
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

    var UtilityDefinitions = {
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
            "split": {
                "args": [
                    "String"
                ],
                "infiniteArgs": false,
                "returns": "List<String>"
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

    /* src/components/flow_objects/CallExpression.svelte generated by Svelte v3.46.2 */
    const file$6 = "src/components/flow_objects/CallExpression.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (45:12) {:else}
    function create_else_block_1$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = Array(/*utilityDef*/ ctx[1]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
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
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
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
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(45:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:16) {#each Array(utilityDef) as i}
    function create_each_block_1$2(ctx) {
    	let div;
    	let stringliteral;
    	let updating_parentRef;
    	let current;

    	function stringliteral_parentRef_binding(value) {
    		/*stringliteral_parentRef_binding*/ ctx[9](value);
    	}

    	let stringliteral_props = {
    		accessor: /*i*/ ctx[12],
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
    			add_location(div, file$6, 46, 20, 1958);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(stringliteral, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stringliteral_changes = {};
    			if (dirty & /*utilityDef*/ 2) stringliteral_changes.accessor = /*i*/ ctx[12];

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
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(46:16) {#each Array(utilityDef) as i}",
    		ctx
    	});

    	return block;
    }

    // (41:20) {:else}
    function create_else_block$2(ctx) {
    	let switch_instance;
    	let updating_parentRef;
    	let switch_instance_anchor;
    	let current;

    	function switch_instance_parentRef_binding_1(value) {
    		/*switch_instance_parentRef_binding_1*/ ctx[8](value);
    	}

    	var switch_value = /*constructors*/ ctx[2][/*argument*/ ctx[10].type];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			accessor: /*i*/ ctx[12],
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
    			if (dirty & /*self*/ 1) switch_instance_changes.accessor = /*i*/ ctx[12];

    			if (!updating_parentRef && dirty & /*self*/ 1) {
    				updating_parentRef = true;
    				switch_instance_changes.parentRef = /*self*/ ctx[0].arguments;
    				add_flush_callback(() => updating_parentRef = false);
    			}

    			if (switch_value !== (switch_value = /*constructors*/ ctx[2][/*argument*/ ctx[10].type])) {
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
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(41:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (39:20) {#if argument.type === "CallExpression"}
    function create_if_block$3(ctx) {
    	let callexpression;
    	let updating_parentRef;
    	let current;

    	function callexpression_parentRef_binding(value) {
    		/*callexpression_parentRef_binding*/ ctx[7](value);
    	}

    	let callexpression_props = { accessor: /*i*/ ctx[12] };

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
    			if (dirty & /*self*/ 1) callexpression_changes.accessor = /*i*/ ctx[12];

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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(39:20) {#if argument.type === \\\"CallExpression\\\"}",
    		ctx
    	});

    	return block;
    }

    // (37:12) {#each self.arguments as argument, i (i)}
    function create_each_block$2(key_1, ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*argument*/ ctx[10].type === "CallExpression") return 0;
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
    			add_location(div, file$6, 37, 16, 1483);
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
    		source: "(37:12) {#each self.arguments as argument, i (i)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
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
    		/*switch_instance_parentRef_binding*/ ctx[6](value);
    	}

    	var switch_value = /*constructors*/ ctx[2][/*self*/ ctx[0].callee.type];

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
    		switch_instance.$on("changeMethod", /*onMethodChange*/ ctx[3]);
    	}

    	let each_value = /*self*/ ctx[0].arguments;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[12];
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_1$1(ctx);
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
    			add_location(span, file$6, 33, 4, 1238);
    			set_style(p, "padding-left", "10px");
    			add_location(p, file$6, 32, 0, 1203);
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

    			if (switch_value !== (switch_value = /*constructors*/ ctx[2][/*self*/ ctx[0].callee.type])) {
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
    					switch_instance.$on("changeMethod", /*onMethodChange*/ ctx[3]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, span, t0);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (dirty & /*self, constructors, Array, utilityDef*/ 7) {
    				each_value = /*self*/ ctx[0].arguments;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, span, outro_and_destroy_block, create_each_block$2, t1, get_each_context$2);
    				check_outros();

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block_1$1(ctx);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let self;
    	let utilityDef;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CallExpression', slots, []);
    	let { parentRef } = $$props;
    	let { accessor } = $$props;

    	//console.log(callee);
    	const constructors = {
    		MemberExpression,
    		Identifier,
    		StringLiteral
    	};

    	//const store = useStore();
    	const onMethodChange = payloadObj => {
    		// TODO: commit change to the store using the parentRef from here
    		//store.commit('changeMethod', { refObj: parent.value, accessor: props.accessor, ...payloadObj });
    		$$invalidate(4, parentRef[accessor] = dropDataTemplates.stringUtil(payloadObj.detail.methodName), parentRef);
    	};

    	const writable_props = ['parentRef', 'accessor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CallExpression> was created with unknown prop '${key}'`);
    	});

    	function switch_instance_parentRef_binding(value) {
    		self = value;
    		(($$invalidate(0, self), $$invalidate(4, parentRef)), $$invalidate(5, accessor));
    	}

    	function callexpression_parentRef_binding(value) {
    		if ($$self.$$.not_equal(self.arguments, value)) {
    			self.arguments = value;
    			(($$invalidate(0, self), $$invalidate(4, parentRef)), $$invalidate(5, accessor));
    		}
    	}

    	function switch_instance_parentRef_binding_1(value) {
    		if ($$self.$$.not_equal(self.arguments, value)) {
    			self.arguments = value;
    			(($$invalidate(0, self), $$invalidate(4, parentRef)), $$invalidate(5, accessor));
    		}
    	}

    	function stringliteral_parentRef_binding(value) {
    		if ($$self.$$.not_equal(self.arguments, value)) {
    			self.arguments = value;
    			(($$invalidate(0, self), $$invalidate(4, parentRef)), $$invalidate(5, accessor));
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('parentRef' in $$props) $$invalidate(4, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(5, accessor = $$props.accessor);
    	};

    	$$self.$capture_state = () => ({
    		MemberExpression,
    		Identifier,
    		StringLiteral,
    		UtilityDefinitions,
    		dropDataTemplates,
    		parentRef,
    		accessor,
    		constructors,
    		onMethodChange,
    		self,
    		utilityDef
    	});

    	$$self.$inject_state = $$props => {
    		if ('parentRef' in $$props) $$invalidate(4, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(5, accessor = $$props.accessor);
    		if ('self' in $$props) $$invalidate(0, self = $$props.self);
    		if ('utilityDef' in $$props) $$invalidate(1, utilityDef = $$props.utilityDef);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*parentRef, accessor*/ 48) {
    			$$invalidate(0, self = parentRef[accessor]);
    		}

    		if ($$self.$$.dirty & /*self*/ 1) {
    			$$invalidate(1, utilityDef = self.callee.type === "MemberExpression"
    			? UtilityDefinitions[self.callee.object.name][self.callee.property.name].args
    			: 0);
    		}
    	};

    	return [
    		self,
    		utilityDef,
    		constructors,
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { parentRef: 4, accessor: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CallExpression",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*parentRef*/ ctx[4] === undefined && !('parentRef' in props)) {
    			console.warn("<CallExpression> was created without expected prop 'parentRef'");
    		}

    		if (/*accessor*/ ctx[5] === undefined && !('accessor' in props)) {
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

    /* src/components/flow_objects/UtilityCallExpression.svelte generated by Svelte v3.46.2 */

    const { Object: Object_1 } = globals;
    const file$5 = "src/components/flow_objects/UtilityCallExpression.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (27:8) {#each Object.keys(UtilityDefinitions.StringUtil) as method}
    function create_each_block_2(ctx) {
    	let option;
    	let t_value = /*method*/ ctx[13] + "";
    	let t;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*method*/ ctx[13];
    			option.value = option.__value;
    			option.selected = option_selected_value = /*method*/ ctx[13] === /*self*/ ctx[0].utilityMethod;
    			add_location(option, file$5, 27, 12, 773);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*self*/ 1 && option_selected_value !== (option_selected_value = /*method*/ ctx[13] === /*self*/ ctx[0].utilityMethod)) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(27:8) {#each Object.keys(UtilityDefinitions.StringUtil) as method}",
    		ctx
    	});

    	return block;
    }

    // (40:8) {:else}
    function create_else_block_1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = UtilityDefinitions[/*self*/ ctx[0].utilityName][/*self*/ ctx[0].utilityMethod].args;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
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
    			if (dirty & /*self*/ 1) {
    				each_value_1 = UtilityDefinitions[/*self*/ ctx[0].utilityName][/*self*/ ctx[0].utilityMethod].args;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
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
    		source: "(40:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:12) {#each UtilityDefinitions[self.utilityName][self.utilityMethod].args as type, i}
    function create_each_block_1$1(ctx) {
    	let div;
    	let stringliteral;
    	let updating_parentRef;
    	let current;

    	function stringliteral_parentRef_binding(value) {
    		/*stringliteral_parentRef_binding*/ ctx[7](value);
    	}

    	let stringliteral_props = {
    		accessor: /*i*/ ctx[10],
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
    			add_location(div, file$5, 41, 16, 1456);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(stringliteral, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stringliteral_changes = {};

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
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(41:12) {#each UtilityDefinitions[self.utilityName][self.utilityMethod].args as type, i}",
    		ctx
    	});

    	return block;
    }

    // (36:16) {:else}
    function create_else_block$1(ctx) {
    	let switch_instance;
    	let updating_parentRef;
    	let switch_instance_anchor;
    	let current;

    	function switch_instance_parentRef_binding(value) {
    		/*switch_instance_parentRef_binding*/ ctx[6](value);
    	}

    	var switch_value = /*constructors*/ ctx[1][/*argument*/ ctx[8].type];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			accessor: /*i*/ ctx[10],
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
    			if (dirty & /*self*/ 1) switch_instance_changes.accessor = /*i*/ ctx[10];

    			if (!updating_parentRef && dirty & /*self*/ 1) {
    				updating_parentRef = true;
    				switch_instance_changes.parentRef = /*self*/ ctx[0].arguments;
    				add_flush_callback(() => updating_parentRef = false);
    			}

    			if (switch_value !== (switch_value = /*constructors*/ ctx[1][/*argument*/ ctx[8].type])) {
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
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(36:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:16) {#if argument.type === "UtilityCallExpression"}
    function create_if_block$2(ctx) {
    	let utilitycallexpression;
    	let updating_parentRef;
    	let current;

    	function utilitycallexpression_parentRef_binding(value) {
    		/*utilitycallexpression_parentRef_binding*/ ctx[5](value);
    	}

    	let utilitycallexpression_props = { accessor: /*i*/ ctx[10] };

    	if (/*self*/ ctx[0].arguments !== void 0) {
    		utilitycallexpression_props.parentRef = /*self*/ ctx[0].arguments;
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
    			if (dirty & /*self*/ 1) utilitycallexpression_changes.accessor = /*i*/ ctx[10];

    			if (!updating_parentRef && dirty & /*self*/ 1) {
    				updating_parentRef = true;
    				utilitycallexpression_changes.parentRef = /*self*/ ctx[0].arguments;
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
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(34:16) {#if argument.type === \\\"UtilityCallExpression\\\"}",
    		ctx
    	});

    	return block;
    }

    // (32:8) {#each self.arguments as argument, i (i)}
    function create_each_block$1(key_1, ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*argument*/ ctx[8].type === "UtilityCallExpression") return 0;
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
    			add_location(div, file$5, 32, 12, 960);
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(32:8) {#each self.arguments as argument, i (i)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let p;
    	let span;
    	let t0_value = /*self*/ ctx[0].utilityName + "";
    	let t0;
    	let t1;
    	let select;
    	let t2;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let t3;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_2 = Object.keys(UtilityDefinitions.StringUtil);
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value = /*self*/ ctx[0].arguments;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[10];
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	let each1_else = null;

    	if (!each_value.length) {
    		each1_else = create_else_block_1(ctx);
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

    			t2 = text("\n    (\n        ");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each1_else) {
    				each1_else.c();
    			}

    			t3 = text("\n    )");
    			add_location(select, file$5, 25, 29, 654);
    			add_location(span, file$5, 25, 4, 629);
    			set_style(p, "padding-left", "10px");
    			add_location(p, file$5, 24, 0, 594);
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

    			if (each1_else) {
    				each1_else.m(p, null);
    			}

    			append_dev(p, t3);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*onPropertyChange*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*self*/ 1) && t0_value !== (t0_value = /*self*/ ctx[0].utilityName + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*Object, UtilityDefinitions, self*/ 1) {
    				each_value_2 = Object.keys(UtilityDefinitions.StringUtil);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*self, constructors, UtilityDefinitions*/ 3) {
    				each_value = /*self*/ ctx[0].arguments;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each1_lookup, p, outro_and_destroy_block, create_each_block$1, t3, get_each_context$1);
    				check_outros();

    				if (!each_value.length && each1_else) {
    					each1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each1_else = create_else_block_1(ctx);
    					each1_else.c();
    					transition_in(each1_else, 1);
    					each1_else.m(p, t3);
    				} else if (each1_else) {
    					group_outros();

    					transition_out(each1_else, 1, 1, () => {
    						each1_else = null;
    					});

    					check_outros();
    				}
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

    			if (each1_else) each1_else.d();
    			mounted = false;
    			dispose();
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
    	let self;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UtilityCallExpression', slots, []);
    	let { parentRef } = $$props;
    	let { accessor } = $$props;
    	const constructors = { CallExpression, StringLiteral };

    	const onPropertyChange = event => {
    		$$invalidate(
    			3,
    			parentRef[accessor] = {
    				...self,
    				utilityMethod: event.target.value,
    				"arguments": []
    			},
    			parentRef
    		);
    	};

    	const writable_props = ['parentRef', 'accessor'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UtilityCallExpression> was created with unknown prop '${key}'`);
    	});

    	function utilitycallexpression_parentRef_binding(value) {
    		if ($$self.$$.not_equal(self.arguments, value)) {
    			self.arguments = value;
    			(($$invalidate(0, self), $$invalidate(3, parentRef)), $$invalidate(4, accessor));
    		}
    	}

    	function switch_instance_parentRef_binding(value) {
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
    		CallExpression,
    		StringLiteral,
    		UtilityDefinitions,
    		parentRef,
    		accessor,
    		constructors,
    		onPropertyChange,
    		self
    	});

    	$$self.$inject_state = $$props => {
    		if ('parentRef' in $$props) $$invalidate(3, parentRef = $$props.parentRef);
    		if ('accessor' in $$props) $$invalidate(4, accessor = $$props.accessor);
    		if ('self' in $$props) $$invalidate(0, self = $$props.self);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*parentRef, accessor*/ 24) {
    			$$invalidate(0, self = parentRef[accessor]);
    		}
    	};

    	return [
    		self,
    		constructors,
    		onPropertyChange,
    		parentRef,
    		accessor,
    		utilitycallexpression_parentRef_binding,
    		switch_instance_parentRef_binding,
    		stringliteral_parentRef_binding
    	];
    }

    class UtilityCallExpression extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { parentRef: 3, accessor: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UtilityCallExpression",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*parentRef*/ ctx[3] === undefined && !('parentRef' in props)) {
    			console.warn("<UtilityCallExpression> was created without expected prop 'parentRef'");
    		}

    		if (/*accessor*/ ctx[4] === undefined && !('accessor' in props)) {
    			console.warn("<UtilityCallExpression> was created without expected prop 'accessor'");
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
    }

    /* src/components/flow_objects/ExpressionStatement.svelte generated by Svelte v3.46.2 */

    const file$4 = "src/components/flow_objects/ExpressionStatement.svelte";

    // (65:4) {:else}
    function create_else_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Drag an action here";
    			attr_dev(p, "class", "dull-text");
    			add_location(p, file$4, 65, 8, 1804);
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
    		id: create_else_block.name,
    		type: "else",
    		source: "(65:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:4) {#if self.expression !== null}
    function create_if_block$1(ctx) {
    	let switch_instance;
    	let updating_parentRef;
    	let switch_instance_anchor;
    	let current;

    	function switch_instance_parentRef_binding(value) {
    		/*switch_instance_parentRef_binding*/ ctx[10](value);
    	}

    	var switch_value = /*constructors*/ ctx[4][/*self*/ ctx[3].expression.type];

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

    			if (switch_value !== (switch_value = /*constructors*/ ctx[4][/*self*/ ctx[3].expression.type])) {
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(63:4) {#if self.expression !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*self*/ ctx[3].expression !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if_block.c();
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "expression-container svelte-1u12z2p");
    			add_location(div0, file$4, 58, 0, 1473);
    			attr_dev(div1, "class", "line-down-box svelte-1u12z2p");
    			toggle_class(div1, "insert-drag-over", /*isOverInsertSpot*/ ctx[2]);
    			add_location(div1, file$4, 68, 0, 1866);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			if_blocks[current_block_type_index].m(div0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "dragover", prevent_default(dragOverHandler$1), false, true, false),
    					listen_dev(div0, "drop", stop_propagation(prevent_default(/*dropModify*/ ctx[8])), false, true, true),
    					listen_dev(div1, "dragover", prevent_default(insertDragOverHandler), false, true, false),
    					listen_dev(div1, "dragenter", prevent_default(/*insertDragEnter*/ ctx[5]), false, true, false),
    					listen_dev(div1, "dragleave", prevent_default(/*insertDragLeave*/ ctx[6]), false, true, false),
    					listen_dev(div1, "drop", stop_propagation(prevent_default(/*insertDrop*/ ctx[9])), false, true, true),
    					listen_dev(div1, "drop", stop_propagation(prevent_default(/*removeInsertHover*/ ctx[7])), false, true, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
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
    				if_block.m(div0, null);
    			}

    			if (dirty & /*isOverInsertSpot*/ 4) {
    				toggle_class(div1, "insert-drag-over", /*isOverInsertSpot*/ ctx[2]);
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
    			if (detaching) detach_dev(div0);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
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

    function dragOverHandler$1(event) {
    	
    } // do something like change cursor
    //event.stopPropagation();

    function insertDragOverHandler(event) {
    	
    } // something

    function instance$5($$self, $$props, $$invalidate) {
    	let self;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExpressionStatement', slots, []);
    	let { accessor } = $$props;
    	let { parentRef } = $$props;
    	const constructors = { CallExpression, UtilityCallExpression };
    	let isOverInsertSpot = false;

    	function insertDragEnter(event) {
    		$$invalidate(2, isOverInsertSpot = true);
    	}

    	function insertDragLeave(event) {
    		$$invalidate(2, isOverInsertSpot = false);
    	}

    	function removeInsertHover(event) {
    		$$invalidate(2, isOverInsertSpot = false);
    	}

    	function dropModify(event) {
    		const node = dropModifyObjectHandler(event);

    		if (node.type === 'ExpressionStatement') {
    			$$invalidate(0, parentRef[accessor].expression = null, parentRef);
    			return;
    		}

    		$$invalidate(0, parentRef[accessor].expression = node, parentRef);
    	}

    	/**
     * @param {DragEvent} event
     */
    	function insertDrop(event) {
    		const astNodes = dropInsertAstCreation(event);
    		parentRef.splice(accessor + 1, 0, astNodes);
    		$$invalidate(0, parentRef = [...parentRef]);
    	}

    	const writable_props = ['accessor', 'parentRef'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExpressionStatement> was created with unknown prop '${key}'`);
    	});

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
    		CallExpression,
    		UtilityCallExpression,
    		dropInsertAstCreation,
    		dropModifyObjectHandler,
    		accessor,
    		parentRef,
    		constructors,
    		isOverInsertSpot,
    		dragOverHandler: dragOverHandler$1,
    		insertDragOverHandler,
    		insertDragEnter,
    		insertDragLeave,
    		removeInsertHover,
    		dropModify,
    		insertDrop,
    		self
    	});

    	$$self.$inject_state = $$props => {
    		if ('accessor' in $$props) $$invalidate(1, accessor = $$props.accessor);
    		if ('parentRef' in $$props) $$invalidate(0, parentRef = $$props.parentRef);
    		if ('isOverInsertSpot' in $$props) $$invalidate(2, isOverInsertSpot = $$props.isOverInsertSpot);
    		if ('self' in $$props) $$invalidate(3, self = $$props.self);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*parentRef, accessor*/ 3) {
    			$$invalidate(3, self = parentRef[accessor]);
    		}
    	};

    	return [
    		parentRef,
    		accessor,
    		isOverInsertSpot,
    		self,
    		constructors,
    		insertDragEnter,
    		insertDragLeave,
    		removeInsertHover,
    		dropModify,
    		insertDrop,
    		switch_instance_parentRef_binding
    	];
    }

    class ExpressionStatement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { accessor: 1, parentRef: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExpressionStatement",
    			options,
    			id: create_fragment$5.name
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

    /* src/components/flow_objects/IfStatement.svelte generated by Svelte v3.46.2 */

    const file$3 = "src/components/flow_objects/IfStatement.svelte";

    // (8:48) {#if alternate !== null}
    function create_if_block(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*alternate*/ ctx[2].type + "";
    	let t1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("else ");
    			t1 = text(t1_value);
    			add_location(span, file$3, 7, 72, 172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*alternate*/ 4 && t1_value !== (t1_value = /*alternate*/ ctx[2].type + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(8:48) {#if alternate !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*test*/ ctx[0].type + "";
    	let t1;
    	let t2;
    	let t3_value = /*consequent*/ ctx[1].type + "";
    	let t3;
    	let t4;
    	let if_block = /*alternate*/ ctx[2] !== null && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("If (");
    			t1 = text(t1_value);
    			t2 = text(") then ");
    			t3 = text(t3_value);
    			t4 = space();
    			if (if_block) if_block.c();
    			add_location(div, file$3, 6, 0, 94);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*test*/ 1 && t1_value !== (t1_value = /*test*/ ctx[0].type + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*consequent*/ 2 && t3_value !== (t3_value = /*consequent*/ ctx[1].type + "")) set_data_dev(t3, t3_value);

    			if (/*alternate*/ ctx[2] !== null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
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

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IfStatement', slots, []);
    	let { test } = $$props;
    	let { consequent } = $$props;
    	let { alternate } = $$props;
    	const writable_props = ['test', 'consequent', 'alternate'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IfStatement> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('test' in $$props) $$invalidate(0, test = $$props.test);
    		if ('consequent' in $$props) $$invalidate(1, consequent = $$props.consequent);
    		if ('alternate' in $$props) $$invalidate(2, alternate = $$props.alternate);
    	};

    	$$self.$capture_state = () => ({ test, consequent, alternate });

    	$$self.$inject_state = $$props => {
    		if ('test' in $$props) $$invalidate(0, test = $$props.test);
    		if ('consequent' in $$props) $$invalidate(1, consequent = $$props.consequent);
    		if ('alternate' in $$props) $$invalidate(2, alternate = $$props.alternate);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [test, consequent, alternate];
    }

    class IfStatement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { test: 0, consequent: 1, alternate: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IfStatement",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*test*/ ctx[0] === undefined && !('test' in props)) {
    			console.warn("<IfStatement> was created without expected prop 'test'");
    		}

    		if (/*consequent*/ ctx[1] === undefined && !('consequent' in props)) {
    			console.warn("<IfStatement> was created without expected prop 'consequent'");
    		}

    		if (/*alternate*/ ctx[2] === undefined && !('alternate' in props)) {
    			console.warn("<IfStatement> was created without expected prop 'alternate'");
    		}
    	}

    	get test() {
    		throw new Error("<IfStatement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set test(value) {
    		throw new Error("<IfStatement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get consequent() {
    		throw new Error("<IfStatement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set consequent(value) {
    		throw new Error("<IfStatement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alternate() {
    		throw new Error("<IfStatement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alternate(value) {
    		throw new Error("<IfStatement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "UtilityCallExpression",
                        "utilityName": "StringUtil",
                        "utilityMethod": "concat",
                        "arguments": [
                            {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "Identifier",
                                    "name": "thing"
                                },
                                "arguments": [
                                    {
                                        "type": "StringLiteral",
                                        "value": "A long string teehee"
                                    }
                                ]
                            },
                            {
                                "type": "StringLiteral",
                                "value": " world!"
                            }
                        ]
                    }
                },
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "UtilityCallExpression",
                        "utilityName": "StringUtil",
                        "utilityMethod": "concat",
                        "arguments": [
                            {
                                "type": "StringLiteral",
                                "value": "hello"
                            },
                            {
                                "type": "StringLiteral",
                                "value": " world!"
                            }
                        ]
                    }
                },
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "UtilityCallExpression",
                        "utilityName": "StringUtil",
                        "utilityMethod": "concat",
                        "arguments": [
                            {
                                "type": "StringLiteral",
                                "value": "more"
                            },
                            {
                                "type": "StringLiteral",
                                "value": " concatenation!"
                            }
                        ]
                    }
                }
            ]
        }
    };

    const ast = writable(
        mockData
    );

    /* src/components/container_components/AppWindow.svelte generated by Svelte v3.46.2 */
    const file$2 = "src/components/container_components/AppWindow.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (53:8) {#each tabs as tab, i}
    function create_each_block_1(ctx) {
    	let div;
    	let t0_value = /*tab*/ ctx[12] + "";
    	let t0;
    	let t1;
    	let div_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", div_class_value = "fn-tab " + (/*activeTab*/ ctx[0] === /*i*/ ctx[11] ? 'active' : '') + " svelte-13zsm1g");
    			add_location(div, file$2, 53, 12, 1439);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*toggleTab*/ ctx[6](/*i*/ ctx[11]), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*activeTab*/ 1 && div_class_value !== (div_class_value = "fn-tab " + (/*activeTab*/ ctx[0] === /*i*/ ctx[11] ? 'active' : '') + " svelte-13zsm1g")) {
    				attr_dev(div, "class", div_class_value);
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
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(53:8) {#each tabs as tab, i}",
    		ctx
    	});

    	return block;
    }

    // (60:4) {#each $ast.main.body as flowObject, i (i)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let switch_instance;
    	let updating_parentRef;
    	let switch_instance_anchor;
    	let current;

    	function switch_instance_parentRef_binding(value) {
    		/*switch_instance_parentRef_binding*/ ctx[8](value);
    	}

    	var switch_value = /*constructors*/ ctx[3][/*flowObject*/ ctx[9].type];

    	function switch_props(ctx) {
    		let switch_instance_props = { accessor: /*i*/ ctx[11] };

    		if (/*$ast*/ ctx[2].main.body !== void 0) {
    			switch_instance_props.parentRef = /*$ast*/ ctx[2].main.body;
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
    			first = empty();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const switch_instance_changes = {};
    			if (dirty & /*$ast*/ 4) switch_instance_changes.accessor = /*i*/ ctx[11];

    			if (!updating_parentRef && dirty & /*$ast*/ 4) {
    				updating_parentRef = true;
    				switch_instance_changes.parentRef = /*$ast*/ ctx[2].main.body;
    				add_flush_callback(() => updating_parentRef = false);
    			}

    			if (switch_value !== (switch_value = /*constructors*/ ctx[3][/*flowObject*/ ctx[9].type])) {
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
    			if (detaching) detach_dev(first);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(60:4) {#each $ast.main.body as flowObject, i (i)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div3;
    	let div1;
    	let div0;
    	let t1;
    	let div2;
    	let t2;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*tabs*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*$ast*/ ctx[2].main.body;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[11];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "I start with no height";
    			t1 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "svelte-13zsm1g");
    			add_location(div0, file$2, 49, 8, 1317);
    			attr_dev(div1, "class", "tab-content svelte-13zsm1g");
    			add_location(div1, file$2, 48, 4, 1251);
    			attr_dev(div2, "class", "flex fn-tab-bar svelte-13zsm1g");
    			add_location(div2, file$2, 51, 4, 1366);
    			attr_dev(div3, "class", "app-window-wrapper svelte-13zsm1g");
    			add_location(div3, file$2, 43, 0, 1116);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			/*div1_binding*/ ctx[7](div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div2, null);
    			}

    			append_dev(div3, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div3, "dragover", prevent_default(dragOverHandler), false, true, false),
    					listen_dev(div3, "drop", stop_propagation(prevent_default(/*appendDrop*/ ctx[4])), false, true, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activeTab, toggleTab, tabs*/ 97) {
    				each_value_1 = /*tabs*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*constructors, $ast*/ 12) {
    				each_value = /*$ast*/ ctx[2].main.body;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each1_lookup, div3, outro_and_destroy_block, create_each_block, null, get_each_context);
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
    			if (detaching) detach_dev(div3);
    			/*div1_binding*/ ctx[7](null);
    			destroy_each(each_blocks_1, detaching);

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
    	component_subscribe($$self, ast, $$value => $$invalidate(2, $ast = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AppWindow', slots, []);
    	const constructors = { ExpressionStatement, IfStatement };

    	const appendDrop = event => {
    		const data = dropInsertAstCreation(event);
    		set_store_value(ast, $ast.main.body = [...$ast.main.body, data], $ast);
    	};

    	let activeTab = -1;
    	const tabs = ["Variables", "Parameters"];
    	let tabContentContainer;

    	const toggleTab = tabIndex => _ => {
    		if (activeTab === tabIndex) {
    			$$invalidate(1, tabContentContainer.style.height = "0", tabContentContainer);
    			$$invalidate(0, activeTab = -1);
    			return;
    		}

    		$$invalidate(1, tabContentContainer.style.height = "auto", tabContentContainer);
    		$$invalidate(0, activeTab = tabIndex);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AppWindow> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			tabContentContainer = $$value;
    			$$invalidate(1, tabContentContainer);
    		});
    	}

    	function switch_instance_parentRef_binding(value) {
    		if ($$self.$$.not_equal($ast.main.body, value)) {
    			$ast.main.body = value;
    			ast.set($ast);
    		}
    	}

    	$$self.$capture_state = () => ({
    		ExpressionStatement,
    		IfStatement,
    		dropInsertAstCreation,
    		ast,
    		constructors,
    		dragOverHandler,
    		appendDrop,
    		activeTab,
    		tabs,
    		tabContentContainer,
    		toggleTab,
    		$ast
    	});

    	$$self.$inject_state = $$props => {
    		if ('activeTab' in $$props) $$invalidate(0, activeTab = $$props.activeTab);
    		if ('tabContentContainer' in $$props) $$invalidate(1, tabContentContainer = $$props.tabContentContainer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		activeTab,
    		tabContentContainer,
    		$ast,
    		constructors,
    		appendDrop,
    		tabs,
    		toggleTab,
    		div1_binding,
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

    /* src/components/container_components/AppWrapper.svelte generated by Svelte v3.46.2 */
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

    /* src/components/Header.svelte generated by Svelte v3.46.2 */

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

    /* src/App.svelte generated by Svelte v3.46.2 */

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
