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
    },
    /** @type {(str1: string, str2: string) => boolean} */
    equalTo(str1, str2) {
        return str1 === str2;
    },
    /** @type {(str1: string, str2: string) => boolean} */
    notEqualTo(str1, str2) {
        return str1 !== str2;
    }
};


const IntegerUtil = {
    /** @type {(num: number) => string} */
    toString(num) {
        return num.toString();
    },
    /** @type {(num1: number, num2: number) => number} */
    add(num1, num2) {
        return num1 + num2;
    },
    /** @type {(num1: number, num2: number) => number} */
    subtract(num1, num2) {
        return num1 - num2;
    },
    /** @type {(num1: number, num2: number) => number} */
    multiply(num1, num2) {
        return num1 * num2;
    },
    /** @type {(num1: number, num2: number) => number} */
    divide(num1, num2) {
        return num1 / num2;
    },
    /** @type {(num1: number, num2: number) => boolean} */
    equalTo(num1, num2) {
        return num1 === num2;
    },
    /** @type {(num1: number, num2: number) => boolean} */
    notEqualTo(num1, num2) {
        return num1 !== num2;
    },
    /** @type {(num1: number, num2: number) => boolean} */
    greaterThan(num1, num2) {
        return num1 > num2;
    },
    /** @type {(num1: number, num2: number) => boolean} */
    greaterThanOrEqual(num1, num2) {
        return num1 >= num2;
    },
    /** @type {(num1: number, num2: number) => boolean} */
    lessThan(num1, num2) {
        return num1 < num2;
    },
    /** @type {(num1: number, num2: number) => boolean} */
    lessThanOrEqual(num1, num2) {
        return num1 <= num2;
    }
};


const BooleanUtil = {
    and(a, b) {
        return a && b;
    },
    or(a, b) {
        return a || b;
    },
    not(b) {
        return !b;
    }
};


const LoggerUtil = {
    logLines: [],
    logString: function (data) {
        // @ts-ignore
        this.logLines.push(data);
        console.log(data);
    },
    logNumber: function (data) {
        // @ts-ignore
        this.logLines.push(data);
        console.log(data);
    }
};


// @ts-ignore
String.prototype.prepend = function(str) {
    return str + this;
};

// @ts-ignore
String.prototype.len = function() {
    return this.length;
};

// @ts-ignore
String.prototype.isEmpty = function() {
    return this.length === 0;
};

// @ts-ignore
String.prototype.isNotEmpty = function() {
    return this.length > 0;
};

// @ts-ignore
String.prototype.equalTo = function(str) {
    return this === str;
};

// @ts-ignore
String.prototype.notEqualTo = function(str) {
    return this !== str;
};


// @ts-ignore
Number.prototype.add = function(num) {
    return this.valueOf() + num;
};

// @ts-ignore
Number.prototype.subtract = function(num) {
    return this.valueOf() - num;
};

// @ts-ignore
Number.prototype.multiplyBy = function(num) {
    return this.valueOf() * num;
};

// @ts-ignore
Number.prototype.divideBy = function(num) {
    return this.valueOf() / num;
};

// @ts-ignore
Number.prototype.equalTo = function(num) {
    return this.valueOf() === num;
};

// @ts-ignore
Number.prototype.notEqualTo = function(num) {
    return this.valueOf() !== num;
};

// @ts-ignore
Number.prototype.lessThan = function(num) {
    return this.valueOf() < num;
};

// @ts-ignore
Number.prototype.lessThanOrEqual = function(num) {
    return this.valueOf() <= num;
};

// @ts-ignore
Number.prototype.greaterThan = function(num) {
    return this.valueOf() > num;
};

// @ts-ignore
Number.prototype.greaterThanOrEqual = function(num) {
    return this.valueOf() >= num;
};


// @ts-ignore
Boolean.prototype.not = function() {
    return !this.valueOf();
};

// @ts-ignore
Boolean.prototype.and = function(a) {
    return this.valueOf() && a;
};

// @ts-ignore
Boolean.prototype.or = function(a) {
    return this.valueOf() || a;
};

export { StringUtil, IntegerUtil, BooleanUtil, LoggerUtil };