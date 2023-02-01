import type { Actions } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ cookies, request }) => {
        const authData = await request.formData();
        const username = authData.get('username');
        const password = authData.get('password');

        if (username && username === 'bob' && password && password === 'bobsecret') {
            const now = new Date();
            cookies.set('authToken', 'abcdefg', {
                domain: 'localhost',
                path: '/',
                httpOnly: true,
                expires: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, now.getMinutes(), now.getSeconds()),
                sameSite: 'strict'
            });
            throw redirect(302, '/app');
        }

        return {
            msg: 'Invalid credentials, try again'
        };
    }
}