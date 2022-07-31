const express = require('express');
const PORT = process.env.PORT || 4200;
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { generateCode } = require('./code_generator/code_generator.js');
const { Buffer } = require('buffer');
const { createHmac } = require('crypto');


const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
    require('dotenv').config();
}
// @ts-ignore
const serviceAccount = isProd && JSON.parse(process.env.FIREBASE_ADMIN_CERT);

(isProd && initializeApp({
    credential: cert(serviceAccount)
}));

const db = isProd && getFirestore();


const app = express();

app.get('/', authCookieParser, checkCookieToken);
app.get('/login', authCookieParser, checkIfAlreadyAuthed);
app.use('/login', express.static('public/login'));
app.use(express.static('public/app'));

app.post('/login', express.urlencoded({ extended: true }), (req, res) => {
    res.type('application/json');
    res.set('Cache-Control', 'no-store');

    const [username, password] = [ req.body.username, req.body.password ];

    const checkUsername = process.env.DEV_Z_USERNAME ?? process.env.Z_USERNAME;
    const checkPassword = process.env.DEV_Z_PASSWORD ?? process.env.Z_PASSWORD;

    if (username !== checkUsername || password !== checkPassword) {
        res.status(403).send(JSON.stringify({ message: 'Failed authentication; credentials incorrect' }));
        return;
    }

    createJWT()
        .then((jwt) => {
            res.set({
                'Location': '/',
                'Set-Cookie': `zflowauth=${jwt}; Domain=${isProd ? 'z-flow.herokuapp.com' : 'localhost'}; Path=/; SameSite=strict; HttpOnly; Max-Age=720000`
            });
            res.status(302).send();
        })
        .catch((e) => {
            res.status(500).send(JSON.stringify({ message: `Failed to produce a token: ${e.message}` }));
        });
});


app.post('/generate-code', authCookieParser, checkCookieToken, express.json(), (req, res) => {
    res.set({
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store'
    });

    if (req.body.entryFunction === undefined) {
        res.status(400).send('Bad message; need entryFunction');
        return;
    }

    generateCode(req.body)
        .then((generatedCode) => {
            res.status(200).send(generatedCode);
        })
        .catch((e) => {
            res.status(500).send('Something broke');
        });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));


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
        "sub": "zman-7211",
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



async function authCookieParser(req, res, next) {
    const cookieHeader = req.get('Cookie') ?? "";

    const zflowMatch = cookieHeader.match(/zflowauth=([^;]+);?.*$/) ?? [];
    req.zflowAuthCookie = (zflowMatch.length < 2) ? "" : zflowMatch[1];
    
    next();
}


async function checkIfAlreadyAuthed(req, res, next) {
    // for /login route, don't need to login if authed already
    if (validateToken(req.zflowAuthCookie)) {
        res.redirect('/');
        return;
    }

    next();
}


async function checkCookieToken(req, res, next) {
    if (validateToken(req.zflowAuthCookie)) {
        next();
        return;
    }

    res.redirect('/login');
}


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

    const signaturesMatch = sigResult.toString('base64') === signature

    return signaturesMatch;
}
