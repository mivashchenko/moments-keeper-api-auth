const express = require('express');
const axios = require('axios');
const app = express();
const { OAuth2Client } = require('google-auth-library');
const userModel = require('./dist/models/user.model').default;
const mongoClient = require('./dist/clients/mongo.client').default;

const run = async () => {
    await mongoClient.start();
    const u = await userModel.create('qwe', 'test', '')
    const u2 = await userModel.findByEmail('qwe')

    console.log(u, 'u')
    console.log(u2, 'u2')
}

run();

const oAuth2Client = new OAuth2Client(
    "495346770053-lo293icmjsacis1jsa2aoegfdk5hn5gp.apps.googleusercontent.com",
    "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",
    "http://localhost:4000/auth/callback"
);

// Auth
app.get('/auth', (req, res) => {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    });

    res.redirect(authorizeUrl);
});

// Auth Callback
app.get('/auth/callback', async (req, res) => {
    const r = await oAuth2Client.getToken(req.query.code);
    // Make sure to set the credentials on the OAuth2 client.
    oAuth2Client.setCredentials(r.tokens);
    console.info('Tokens acquired.', r.tokens);

    const accessToken = oAuth2Client.credentials.access_token;
    const idToken = oAuth2Client.credentials.id_token;

    const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
        {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        }
    );

    console.log(data, 'data')
    res.send({})
});

app.listen(4000, () => {
    console.log("Server Running on port 4000");
});
