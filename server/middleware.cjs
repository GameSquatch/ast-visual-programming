const { validateToken } = require('./utils.cjs');
const express = require('express');


function attachFirestore(db) {
    return async (req, res, next) => {
        req.db = db;
        next();
    };
}


/** @type {express.RequestHandler} */
async function authCookieParser(req, res, next) {
    const cookieHeader = req.get('Cookie') ?? "";

    const zflowMatch = cookieHeader.match(/zflowauth=([^;]+);?.*$/) ?? [];
    // @ts-ignore
    req.zflowAuthCookie = (zflowMatch.length < 2) ? "" : zflowMatch[1];
    
    next();
}



async function checkIfAlreadyAuthed(req, res, next) {
    // for /login route, don't need to login if authed already
    if (validateToken(req.zflowAuthCookie)) {
        res.redirect(req.baseUrl);
        return;
    }

    next();
}




async function checkCookieToken(req, res, next) {
    if (validateToken(req.zflowAuthCookie)) {
        next();
        return;
    }

    if (req.method === 'GET' && !req.path.includes('/api')) {
        res.redirect(`${req.baseUrl}/login`);
        return;
    }

    res.redirect(`${req.baseUrl}/login'`);
}


/** @type {express.ErrorRequestHandler} */
async function errHandler(err, req, res, next) {
    // TODO
}

module.exports = {
    attachFirestore,
    authCookieParser,
    checkIfAlreadyAuthed,
    checkCookieToken,
    errHandler
};