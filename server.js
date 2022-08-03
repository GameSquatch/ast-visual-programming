const express = require('express');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { authCookieParser, checkIfAlreadyAuthed, checkCookieToken, attachFirestore } = require('./server/middleware.js');
const { createJWT, createSetCookieHeader } = require('./server/utils.js');
const apiRouter = require('./server/api_router.js');

const PORT = process.env.PORT || 4200;

const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
    require('dotenv').config();
}
// @ts-ignore
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CERT);

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();


const app = express();

app.use(attachFirestore(db), authCookieParser);

app.use('/api', apiRouter);

app.get('/', checkCookieToken);
app.get('/login', checkIfAlreadyAuthed);

app.use('/', express.static('public/app'));
app.use('/login', express.static('public/login'));


// The user's action of logging in with a form
app.post('/login', express.urlencoded({ extended: true }), (req, res) => {
    res.type('application/json');
    res.set('Cache-Control', 'no-store');

    const [username, password] = [ req.body.username, req.body.password ];

    const checkUsername = process.env.DEV_Z_USERNAME ?? process.env.Z_USERNAME;
    const checkPassword = process.env.DEV_Z_PASSWORD ?? process.env.Z_PASSWORD;

    if (username !== checkUsername || password !== checkPassword) {
        res.redirect('/login?err=Invalid%20credentials');
        return;
    }

    createJWT()
        .then((jwt) => {
            res.set({
                'Location': '/',
                'Set-Cookie': createSetCookieHeader({ isProd, cookieValue: jwt, maxAge: 86400 })
            });
            res.status(302).send();
        })
        .catch((e) => {
            res.status(500).send(JSON.stringify({ message: `Failed to produce a token: ${e.message}` }));
        });
});

app.post('/logout', (req, res) => {
    res.set('Set-Cookie', createSetCookieHeader({ isProd }));
    res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}\n${isProd ? 'https://z-flow.herokuapp.com' : 'http://localhost:' + PORT}`));

