const express = require('express');

const app = express();

app.use('/qrtoqr', express.static(`${__dirname}/dist`));

app.listen(9000, () => { console.log('qr-ar server listening on port 9000'); });
