import { GaxiosError, GaxiosResponse } from 'gaxios';
import { Credentials } from 'google-auth-library/build/src/auth/credentials';
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client';
import readline from 'readline';
import fs from "fs";
import { google, sheets_v4 } from 'googleapis';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client: OAuth2Client, callback: any): void {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code: string): void => {
    rl.close();
    oAuth2Client.getToken(code, (err: GaxiosError | null, token?: Credentials | null): void => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      if (!token) {
        return;
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err): void => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
export function authorize(credentials: any, callback: Function): void {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, 'utf8', (err, token): void => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

export async function retrieveSheet(auth: OAuth2Client | string, sheetId: string, sheetRange: string): Promise<sheets_v4.Schema$ValueRange>{
  const sheets: sheets_v4.Sheets = google.sheets({version: 'v4', auth});
  return new Promise<sheets_v4.Schema$ValueRange>((resolve, reject): void => {
    sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: sheetRange,
    }, (err: Error | null, res?: GaxiosResponse<sheets_v4.Schema$ValueRange> | null): void => {
      if (err) {
        console.log('The API returned an error: ' + err);
        reject(err);
        return;
      }
      if (!res) {
        reject('No data found');
        return;
      }
      resolve(res.data);
    });
  });
}