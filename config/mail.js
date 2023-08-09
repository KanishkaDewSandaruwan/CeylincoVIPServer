const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  '682606529120-flvnsdurijgors8g4dceeok3l6f6pl2k.apps.googleusercontent.com',
  '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',
  'www.ceylinco.lk'
);

// Generate a URL for the user to authenticate
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://mail.google.com/']
});

// Once the user grants permission, you'll get an authorization code
// Exchange the authorization code for access and refresh tokens

