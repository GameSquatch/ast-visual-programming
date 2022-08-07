const StringUtil = {
    /** @type {(...strs: string[]) => string} */
    concat(...strs) {
        return strs.join('');
    },
    /** @type {(str: string) => string} */
    trim(str) {
        return str.trim();
    },
    /** @type {(str: string) => number} */
    length(str) {
        return str.length;
    },
    /** @type {(num: number) => string} */
    fromInt(num) {
        return num.toString();
    },
    /** @type {(str: string, start: number, end: number) => string} */
    substring(str, start, end) {
        return str.substring(start, end);
    }
};


// @ts-ignore
String.prototype.prepend = function(str) {
    return str + this;
};


// @ts-ignore
Number.prototype.add = function(num) {
    return this.valueOf() + num;
}

// @ts-ignore
Number.prototype.subtract = function(num) {
    return this.valueOf() - num;
}

export { StringUtil };