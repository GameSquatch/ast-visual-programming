class TreePath {
    constructor({ stringPath, delimiter = '.' }) {
        this.asString = stringPath;
        this.tokens = stringPath.split(delimiter);
    }
    getTokenAt(pos) {
        if (pos < 0) {
            pos = this.tokens.length + pos;
        }
        return this.tokens[pos];
    }
}
export { TreePath };
//# sourceMappingURL=tree_path.js.map