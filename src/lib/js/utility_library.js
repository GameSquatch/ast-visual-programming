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


const IntegerUtil = {
    /** @type {(num: number) => string} */
    toString(num) {
        return num.toString();
    },
    /** @type {(num1: number, num2: number) => number} */
    add(num1, num2) {
        return num1 + num2;
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
        // @ts-ignore
        document.querySelector('#log-text').textContent = this.logLines.join('\n');
        console.log(data);
    },
    logNumber: function (data) {
        // @ts-ignore
        this.logLines.push(data);
        // @ts-ignore
        document.querySelector('#log-text').textContent = this.logLines.join('\n');
        console.log(data);
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

// @ts-ignore
Boolean.prototype.not = function() {
    return !this.valueOf();
}

// @ts-ignore
Boolean.prototype.and = function(a) {
    return this.valueOf() && a;
}

// @ts-ignore
Boolean.prototype.or = function(a) {
    return this.valueOf() || a;
}

export { StringUtil, IntegerUtil, BooleanUtil, LoggerUtil };