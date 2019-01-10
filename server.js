const express = require('express');

const app = express();

app.use('/qrtoar', express.static(`${__dirname}/dist`));
app.use('/qr-to-ar', express.static(`${__dirname}/dist`));

app.listen(9000, () => { console.log('qr-ar server listening on port 9000'); });
