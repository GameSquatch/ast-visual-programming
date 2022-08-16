import { fileTreeStore, createNodeTreeEntry, createFileTreeReference } from "../components/side_nav/file_tree.js";
import { fileMetadata } from "../components/side_nav/file_metadata.js";
import { mockData } from "../lib/js/data_json.js";
import { v4 as uuidv4 } from 'uuid';

const fileController = {
    createFile({ treePath, title, fileType }) {
        const id = uuidv4();
        const fileData = createFileTreeReference(id);
        
        fileTreeStore.addItemAt({ treePath, itemData: fileData, navType: 'files' });
        fileMetadata.addFile({ id, title, fileType });
        mockData.update((tree) => { tree[fileData.id] = createNodeTreeEntry(id); return tree; });
    }
};

export { fileController };