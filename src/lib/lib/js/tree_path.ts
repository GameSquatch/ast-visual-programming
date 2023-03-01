interface TreePathSpec {
    stringPath: string,
    delimiter?: string
}


class TreePath {
    asString: string;
    tokens: string[];

    constructor({ stringPath, delimiter = '.'}: TreePathSpec) {
        this.asString = stringPath;
        this.tokens = stringPath.split(delimiter);
    }

    getTokenAt(pos: number) {
        if (pos < 0) {
            pos = this.tokens.length + pos;
        }
        return this.tokens[pos];
    }
}

export { TreePath };