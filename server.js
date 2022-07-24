const express = require('express');
const PORT = process.env.PORT || 4200;
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

// @ts-ignore
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CERT);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();


const app = express();

app.use(express.static('public'));

app.get('/function/:id', async (req, res) => {
    const docRef = db.collection('function').doc('func-x');
    try {
        const result = await docRef.get();

        res.status(200).json(result.data());
    } catch (e) {
        res.status(403).send(e.message);
    }
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
