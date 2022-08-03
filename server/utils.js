const { createHmac } = require('crypto');

/**
 * @param {string} token 
 * @returns {boolean}
 */
 function validateToken(token) {
    if (token.length === 0) {
        return false;
    }
    const [ b64Header, b64Body, signature ] = token.split('.');

    if (b64Header === undefined || b64Body === undefined || signature === undefined) {
        return false;
    }

    const secret = process.env.TOKEN_SECRET ?? process.env.DEV_TOKEN_SECRET;
    if (secret === undefined) {
        throw new Error('Env vars are not properly defined');
    }

    const hmac = createHmac('sha256', secret);
    hmac.update(`${b64Header}.${b64Body}`);
    const sigResult = hmac.digest();

    const signaturesMatch = sigResult.toString('base64') === signature;

    return signaturesMatch;
}


/**
 * @function
 * @param {Object} spec
 * @param {boolean} spec.isProd
 * @param {string} [spec.cookieValue="nothing"]
 * @param {number} [spec.maxAge=0]
 * @returns {string}
 */
function createSetCookieHeader({ isProd, cookieValue = "nothing", maxAge = 0 }) {
    return `zflowauth=${cookieValue}; Domain=${isProd ? 'z-flow.herokuapp.com' : 'localhost'}; Path=/; SameSite=strict; HttpOnly; Max-Age=${maxAge}`
}


/**
 * @function
 * @returns {Promise<string>}
 */
 async function createJWT() {
    const header = {
        "alg": "HS256",
        "typ": "JWT"
    };

    const body = {
        "sub": "ewilliams",
        "iat": Date.now(),
        "aud": "z-flow",
        "nonce": Math.floor(Math.random() * 200000),
        "iss": "z-flow"
    };

    const secret = process.env.TOKEN_SECRET ?? process.env.DEV_TOKEN_SECRET;
    if (secret === undefined) {
        throw new Error('Env vars are not defined');
    }

    const signable = `${Buffer.from(JSON.stringify(header)).toString('base64')}.${Buffer.from(JSON.stringify(body)).toString('base64')}`;

    try {
        const hmac = createHmac('sha256', secret);
        hmac.update(signable);
        const digestBuff = hmac.digest();
        return `${signable}.${digestBuff.toString('base64')}`;
    } catch (e) {
        throw new Error(e);
    }
}


/**
 * @function
 * @param {string} msg 
 * @returns {string}
 */
function createMessage(msg) {
    return JSON.stringify({ message: msg });
}

module.exports = {
    validateToken,
    createSetCookieHeader,
    createJWT,
    createMessage
};