
class DropObject {
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