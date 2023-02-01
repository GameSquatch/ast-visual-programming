
class DropObject {
    /**
     * @param {Object} spec
     * @param {Object} spec.dragObject
     * @param {Object|null} [spec.newNode=null]
     * @param {() => void} [spec.preNodeInsertCallback]
     * @param {() => void} [spec.postNodeInsertCallback]
     */
    constructor({
        dragObject,
        newNode = null,
        preNodeInsertCallback = () => {},
        postNodeInsertCallback = () => {}
    }) {
        this.dragObject = dragObject;
        this.newNode = newNode;
        this.preNodeInsertCallback = preNodeInsertCallback;
        this.postNodeInsertCallback = postNodeInsertCallback;
    }
}

export default DropObject;