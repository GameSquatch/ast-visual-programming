import { fileTreeStore, createNodeTreeEntry, createFileTreeReference } from "../components/side_nav/file_tree.js";
import { fileMetadata } from "../components/side_nav/file_metadata.js";
import { editorStore } from "../components/tabbed_editor/editor_store.js";

const fileController = {
    createFile({ treePath, title, fileType }) {
        const id = crypto.randomUUID();
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