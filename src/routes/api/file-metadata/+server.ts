import type { RequestHandler } from "@sveltejs/kit";
import { json } from '@sveltejs/kit'


export const GET: RequestHandler = async function(_) {
    return json({
        fileId: {
            moreData: 'ok'
        }
    });
};