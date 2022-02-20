const express = require('express');
const PORT = process.env.PORT || 4200;

const app = express();

app.use(express.static('public'));

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
