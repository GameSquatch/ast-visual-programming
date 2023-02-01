import type { FileDataDocument } from "$lib/file_data/stores/file_data_store";
import { json, type RequestHandler } from "@sveltejs/kit";

interface FileStore {
    [fileId: string]: FileDataDocument
}

const fileData: Record<string, FileDataDocument> = {
    '6d70d9ea-cebe-4e2b-9c83-722e1d004420': {
        info: {
            id: '6d70d9ea-cebe-4e2b-9c83-722e1d004420',
            variables: {}
        },
        body: []
    }
};

export const GET: RequestHandler = function({ params }) {
    const fileId = params['fileId'];
    if (!fileId) {
        return json({ error: { message: 'Missing file id parameter' }}, { status: 400 });
    }

    if (!fileData[fileId]) {
        return json({ error: { message: 'No file with the given id exists' }}, { status: 404 });
    }
    
    return json(fileData[fileId]);
};