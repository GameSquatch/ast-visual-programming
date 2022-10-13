class TreePath {
    constructor({ stringPath, delimiter = '.' }) {
        /** @type {string} */
        this.asString = stringPath;
        /** @type {string[]} */
        this.tokens = stringPath.split(delimiter);
    }

    getTokenAt(pos) {
        if (pos < 0) {
            pos = this.tokens.length + pos;
        }
        return this.tokens[pos];
    }
}

module.exports = { TreePath };