const express = require('express');
const { checkCookieToken, parseToken } = require('./middleware.js');
const { createMessage } = require('./utils.js');
const { generateCode } = require('../code_generator/code_generator.js');

const router = express.Router();

router.use(checkCookieToken, parseToken, express.json());

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
            res.status(500).send('Something broke');
        });
});


router.post('/file-tree/:fileAction', (req, res) => {
    res.type('application/json');
    /** @type {FirebaseFirestore.Firestore} */
    // @ts-ignore
    const db = req.db;

    const projectRef = db.collection('projects').doc('ewilliams');

    db.runTransaction(async (txn) => {
        txn.set(projectRef, { fileTree: req.body.fileTree }, { merge: true });

        switch (req.params.fileAction) {
            case 'create':
                txn.create(projectRef.collection('files').doc(req.body.fileItemData.id), req.body.fileItemData);
                break;
            case 'update':
                txn.update(projectRef.collection('files').doc(req.body.fileItemData.id), req.body.fileItemData);
                break;
            default:
                break;
        }
    })
    .then(() => {
        res.status(200).send(createMessage('Successfully updated tree and created/updated file'));
    })
    .catch((e) => {
        res.status(502).send(createMessage('Error updating file tree and file'));
    });

    // const docRef = db.collection('projects').doc('ewilliams');
    // docRef.set({ fileTree: req.body }, { merge: true })
    //     .then((result) => {
    //         res.status(200).send(createMessage('Successfully updated file tree'));
    //     })
    //     .catch((e) => {
    //         res.status(502).send(createMessage(`Error saving file tree: ${e.message}`));
    //     });
});

router.get('/file-tree', (req, res) => {
    res.type('application/json');
    /** @type {FirebaseFirestore.Firestore} */
    // @ts-ignore
    const db = req.db;

    const docRef = db.collection('projects').doc('ewilliams');
    docRef.get()
        .then((result) => {
            res.status(200).send(result.data());
        })
        .catch((e) => {
            res.status(502).send(createMessage(`Error retrieving project data: ${e.message}`));
        });
});

router.get('/file-metadata', (req, res) => {
    res.type('application/json');
    /** @type {FirebaseFirestore.Firestore} */
    // @ts-ignore
    const db = req.db;

    const docRef = db.collection('projects').doc('ewilliams').collection('file-metadata').doc('map');
    docRef.get()
        .then((result) => {
            res.status(200).send(result.data());
        })
        .catch((e) => {
            res.status(502).send(createMessage(`Error retrieving file metadata: ${e.message}`));
        })
});

router.route('/file/:id')
    .get((req, res) => {
        res.type('application/json');
        /** @type {FirebaseFirestore.Firestore} */
        // @ts-ignore
        const db = req.db;

        const docRef = db.collection('projects').doc('ewilliams').collection('files').doc(req.params.id);
        docRef.get()
            .then((result) => {
                res.status(200).send(result.data());
            });
    })
    .put((req, res) => {

    })
    .delete((req, res) => {

    });

module.exports = router;