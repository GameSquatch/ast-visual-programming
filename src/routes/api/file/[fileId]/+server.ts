import { json, type RequestHandler } from "@sveltejs/kit";

interface FileData {
    [fileId: string]: {
        info: {
            id: string,
            variables: {
                [varId: string]: any
            }
        },
        body: any[]
    }
}

const fileData: FileData = {
    'factorial': {
        info: {
            id: 'factorial',
            variables: {}
        },
        body: []
    },
    'abc': {
        info: {
            id: 'abc',
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