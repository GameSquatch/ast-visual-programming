const { validateToken } = require('./utils.js');
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


async function parseToken(req, res, next) {
    const [ b64header, b64Body, signature ] = req.zflowAuthCookie.split('.');
    const tokenBodyStr = Buffer.from(b64Body, 'base64').toString();

    const tokenBody = JSON.parse(tokenBodyStr);
    req.tokenBody = tokenBody;
    next();
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
    parseToken,
    errHandler
};