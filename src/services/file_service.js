import { fileTreeStore } from "../components/side_nav/file_tree.js"
import { fileMetadata } from "../components/side_nav/file_metadata.js";

const fileService = {
    treeStore: fileTreeStore,
    metadata: fileMetadata,
    createFile() {
        // update stores
        // post to server api
        // input
           // file tree
           // metadata
        // process
           // update file tree
           // update metadata
           // create file based on file type (e.g. function)
    }
};

const fileCreationTemplates = {
    "function": ({ id }) => ({
        main: {
            info: {
                id,
                variables: {},
                dataType: "String"
            },
            body: []
        }
    })
};

export { fileService };