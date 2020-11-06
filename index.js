const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const config = require('./config');
const routes = require('./api/routes');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.use(helmet());
app.use(express.json());
app.set('json spaces', 4);

app.use('/v1', routes);

if (process.env.PRODUCTION) {
    const {domain} = config;
    const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`, 'utf8');
    const certificate = fs.readFileSync(`/etc/letsencrypt/live/${domain}/cert.pem`, 'utf8');
    const ca = fs.readFileSync(`/etc/letsencrypt/live/${domain}/chain.pem`, 'utf8');
    https.createServer({
        key: privateKey,
        cert: certificate,
        ca: ca
    }, app).listen(config.port, function () {
        console.log(`Serveur ouvert en mode production sur le port ${config.port}.`);
    });
} else {
    app.listen(config.port, function () {
        console.log(`Serveur ouvert en mode développement sur le port ${config.port}.`);
    });
}

