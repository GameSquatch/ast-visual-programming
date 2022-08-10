const express = require('express');
const { checkCookieToken } = require('./middleware.js');
const { generateCode } = require('../code_generator/code_generator.js');
const router = express.Router();

router.use(checkCookieToken, express.json());

router.post('/generate-code', (req, res) => {
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
            res.status(500).send('Something broke: ' + e.message);
        });
});

module.exports = router;