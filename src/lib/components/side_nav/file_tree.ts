import { writable } from 'svelte/store';
import { TreePath } from '../../lib/js/tree_path.js';

interface FileTreeItem {
    type: string,
    id: string
}
interface FileTreeFolder {
    files: FileTreeItem[],
    folders: FileTreeFolder[],
    id: string,
    title: string,
    type: string
}

interface FileTreeRoot {
    files: FileTreeItem[],
    folders: FileTreeFolder[]
}


const startValue: FileTreeRoot = {
    files: [
        {
            type: "file",
            id: "abc"
        },
        {
            type: "file",
            id: "factorial"
        }
    ],
    folders: [
        createFolder({ title: 'folder' })
    ]
};

const { subscribe, set, update } = writable<FileTreeRoot>(startValue);

const fileTreeStore = {
    subscribe,
    set,
    update,
    moveItem({ from, to, navType = 'files' }: { from: string, to: string, navType: "files" | "folders" }) {
        this.update((tree) => {
            const fromPath = new TreePath({ stringPath: from });
            const toPath = new TreePath({ stringPath: to });

            let fromArr: any = tree;
            fromPath.tokens.forEach((token, i, tokens) => {
                if (i === tokens.length - 1) return;
                fromArr = fromArr[token];
            });
            const index = parseInt(fromPath.getTokenAt(-1))
            // Take a copy instead of splicing out
            const fromObj = fromArr[index];

            let locationArr: any = tree;
            if (toPath.tokens.length > 1) {
                toPath.tokens.forEach((token) => {
                    locationArr = locationArr[token];
                });
            }

            // Need to splice after we use location, because moving things at the same level
            // will change the indices at which those things exist in the arrays
            fromArr.splice(index, 1)[0];
            locationArr[navType] = [
                ...locationArr[navType],
                fromObj
            ];

            return tree;
        });
    },
    addItemAt({ treePath, itemData, navType = 'files' }: { treePath: string, itemData: Record<string, any>, navType: "files" | "folders" }) {
        const path = new TreePath({ stringPath: treePath });

        this.update((tree) => {
            let location: any = tree;
            if (path.tokens.length > 1) {
                path.tokens.forEach((token, i, tokens) => {
                    location = location[token];
                });
            }

            location[navType] = [
                ...location[navType],
                itemData
            ];

            return tree;
        });
    },
    createRootFile({ id }: { id: string }) {
        this.update((tree) => {
            tree.files.push(createFileTreeReference(id));
            return tree;
        });
    },
    createRootFolder({ title }: { title: string }) {
        this.update((tree) => {
            tree.folders.push(createFolder({ title }));
            return tree;
        });
    }
};



function createFileTreeReference(id: string): FileTreeItem {
    id = id || crypto.randomUUID();
    return {
        id,
        type: 'file'
    };
}

interface CreateFolderParam {
    title: string,
    id?: string,
    files?: FileTreeItem[],
    folders?: FileTreeFolder[]
}

function createFolder({ title, id = crypto.randomUUID(), files = [], folders = [] }: CreateFolderParam): FileTreeFolder {
    return {
        title,
        id,
        type: 'folder',
        files,
        folders
    };
}

function createNodeTreeEntry(id: string) {
    return {
        info: {
            id,
            variables: {},
            dataType: "String"
        },
        body: []
    };
}

export { fileTreeStore, createFileTreeReference, createFolder, createNodeTreeEntry };