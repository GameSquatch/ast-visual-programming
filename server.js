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
    const docRef = db.collection('function').doc(req.params.id);
    try {
        const data = await docRef.set({
            "main": {
                "info": {
                    "id": "123",
                    "variables": {
                        "var-x": {
                            "name": "Fn2Str",
                            "defaultValue": "hello",
                            "dataType": "String"
                        }
                    },
                    "parameters": {}
                },
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "id": "expr-1",
                        "expression": {
                            "type": "AssignmentExpression",
                            "left": {
                                "type": "VariableRefIdentifier",
                                "refId": "var-x",
                                "dataType": "String",
                                "fnRefType": "variables"
                            },
                            "right": null
                        }
                    },
                ]
            }
        });

        res.status(200).json({ msg: "Data uploaded", result: `${data.writeTime}` });
    } catch (e) {
        res.status(403).send(e.message);
    }
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
