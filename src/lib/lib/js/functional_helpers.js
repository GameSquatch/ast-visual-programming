
const compose = (...fns) => (...args) => {
    return fns.reduceRight((acc, fn) => [fn(...acc)], args)[0];
};

const curry = (fn) => {
    let arity = fn.length;

    return function $curry(...args) {
        if (args.length < arity) {
            return $curry.bind(null, ...args);
        }

        return fn.apply(null, args);
    };
};

const map = curry((fn, xs) => xs.map(fn));

const prop = curry((name, obj) => obj[name]);

export { compose, curry, map, prop };