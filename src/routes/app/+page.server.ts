import type { PageServerLoad } from "./$types";
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = function({ cookies }) {
    const authToken = cookies.get('authToken') ?? null;

    if (authToken === null) {
        throw redirect(302, '/login');
    }
};