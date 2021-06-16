const express = require('express');
const uuid = require('uuid');
const Api = require('./api');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const Reasons = {
    DRH_OK: 0,
    DRH_INVALID_CREDENTIAL: 1
}

const unauthorizedRegions = ['/login', '/status', '/access']
const vueUnauthorizedRegions = ['/', '/login']
const salt = crypto.randomBytes(16);

class WebToken {
    constructor() {
        this.tokenId = uuid.v4();
        this.properties = {};
        this._cachedTokenId = null;
    }
    getProperty(name) {
        return this.properties[name];
    }
    setProperty(name, value) {
        this.properties[name] = value;
    }
    get derivedTokenId() {
        if (!this._cachedTokenId) {
            let tokenBuffer = crypto.scryptSync(this.tokenId, salt, 24);
            this._cachedTokenId = tokenBuffer.toString('base64');
        }
        return this._cachedTokenId
    }
}

const idTokenMap = {};

function server() {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', ['X-Token-Scrypt']);
        const tokenId = req.get('X-Token-Scrypt');
        req.token = idTokenMap[tokenId];
        if (!req.token && !unauthorizedRegions.includes(req.path)) {
            res.status(403).send('Please login first.');
        }
        else next();
    });
    app.post('/login', async (req, res) => {
        const query = req.body || {};
        if (!query.user || !query.password) {
            res.status(400).send('insufficient parameters.');
            return;
        }
        const user = await Api.getUserByName(query.user);
        if (!user) {
            res.send({ success: false, reason: Reasons.DRH_INVALID_CREDENTIAL });
            return;
        }
        if (await Api.verifyPassword(query.password, user.pswd)) {
            let token = new WebToken();
            token.setProperty('user', user);
            idTokenMap[token.derivedTokenId] = token;
            res.send({ success: true, tokenId: token.derivedTokenId });
        }
        else res.send({ success: false, reason: Reasons.DRH_INVALID_CREDENTIAL });
    })
    app.get('/status', (req, res) => {
        res.send({ success: true, status: req.token !== undefined });
    })
    app.get('/access', (req, res) => {
        const query = req.query || {};
        if (!query.path) {
            res.status(400).send('insufficient parameters.');
            return;
        }
        if (req.token)
            res.send({ success: true, accessible: true });
        else
            res.send({ success: true, accessible: vueUnauthorizedRegions.includes(query.path) });
    })
    Api.initialize();
    return app;
}

module.exports = server;