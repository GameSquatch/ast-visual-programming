import { fileTreeStore, createNodeTreeEntry, createFileTreeReference } from "../components/side_nav/file_tree.js";
import { fileMetadata } from "../components/side_nav/file_metadata.js";
import { editorStore } from "../components/tabbed_editor/editor_store.js";
import { v4 as uuidv4 } from 'uuid';

const fileController = {
    createFile({ treePath, title, fileType }) {
        const id = uuidv4();
        const fileData = createFileTreeReference(id);
        
        fileTreeStore.addItemAt({ treePath, itemData: fileData, navType: 'files' });
        fileMetadata.addFile({ id, title, fileType });
        editorStore.update((state) => {
            state.tabs[id] = {
                fileId: id,
                data: Promise.resolve(createNodeTreeEntry(id))
            };
            return state;
        });
    }
};

export { fileController };