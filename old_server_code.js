const express = require('express');
const { authCookieParser, checkIfAlreadyAuthed, checkCookieToken } = require('./server/middleware.cjs');
const { createJWT, createSetCookieHeader } = require('./server/utils.cjs');
const { startSocketServer } = require('./server/socket/socket_server.cjs');
const http = require('http');
const { apiRouter } = require('./server/api_router.cjs');

const PORT = process.env.PORT || 4200;

const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
    require('dotenv').config();
}

const app = express();

const server = http.createServer(app);
const io = startSocketServer(server);

app.use(authCookieParser);

app.use('/api', (req, res, next) => {
    // @ts-ignore
    req.io = io;
    next();
}, apiRouter);
app.get('/', (req, res) => res.redirect('/app'));


const appRouter = express.Router();
appRouter.get(/^\/(chat|run)?\/?$/, checkCookieToken);
appRouter.get('/login', checkIfAlreadyAuthed);

appRouter.use(express.static('public/app'));
appRouter.use(/^\/(chat|run)\/?$/, express.static('public/app'));

appRouter.use('/login', express.static('public/login'));


// The user's action of logging in with a form
appRouter.post('/login', express.urlencoded({ extended: true }), (req, res) => {
    res.type('application/json');
    res.set('Cache-Control', 'no-store');

    const [ username, password ] = [ req.body.username, req.body.password ];

    const checkUsername = process.env.DEV_Z_USERNAME ?? process.env.Z_USERNAME;
    const checkPassword = process.env.DEV_Z_PASSWORD ?? process.env.Z_PASSWORD;

    if (username !== checkUsername || password !== checkPassword) {
        res.redirect('/login?err=Invalid%20credentials');
        return;
    }

    createJWT()
        .then((jwt) => {
            res.set({
                'Location': `${req.baseUrl}/`,
                'Set-Cookie': createSetCookieHeader({ isProd, cookieValue: jwt, maxAge: 86400 })
            });
            res.status(302).send();
        })
        .catch((e) => {
            res.status(500).send(JSON.stringify({ message: `Failed to produce a token: ${e.message}` }));
        });
});

appRouter.post('/logout', (req, res) => {
    res.set('Set-Cookie', createSetCookieHeader({ isProd }));
    res.sendStatus(200);
});

app.use('/app', appRouter);


server.listen(PORT, () => console.log(`Listening on ${PORT}\n${isProd ? 'https://z-flow.herokuapp.com' : 'http://localhost:' + PORT}`));

