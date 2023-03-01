import type { RequestHandler } from "@sveltejs/kit";
import { generateCode } from "./code_generator.js";


export const POST: RequestHandler = async function({ request }) {
    try {
        const codeData = await request.json();
        return new Response(await generateCode(codeData));
    } catch (_) {
        return new Response('alert("err");');
    }
    
};