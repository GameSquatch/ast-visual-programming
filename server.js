const express = require('express');
const PORT = process.env.PORT || 4200;
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { generateCode } = require('./code_generator/code_generator.js');


const isProd = !!process.env.FIREBASE_ADMIN_CERT;
// @ts-ignore
const serviceAccount = isProd && JSON.parse(process.env.FIREBASE_ADMIN_CERT);

(isProd && initializeApp({
  credential: cert(serviceAccount)
}));

const db = isProd && getFirestore();


const app = express();

app.use('/', express.static('public'));

// app.get('/function/:id', async (req, res) => {
//     const docRef = db.collection('function').doc('func-x');
//     try {
//         const result = await docRef.get();

//         res.status(200).json(result.data());
//     } catch (e) {
//         res.status(403).send(e.message);
//     }
// });

app.post('/generate-code', express.json(), (req, res) => {
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

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
