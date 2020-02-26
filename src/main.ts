import fs from "fs";
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client';
import { Card } from "./Card/Card";
import { ITextCardOpts, TextCard } from "./Card/TextCard";
import { authorize, retrieveSheet } from "./google.api";

const OUTPUT_DIR = __dirname + '/output';

const apSpreadSheetId = '1LHz2cNZJOJqT9gIic-RBy1TX4iLk8rRHZbk73Nrz1J4';
const textCardRange = "'TextCard Template'!A2:N1002";

async function generateTextCards(auth: OAuth2Client | string): Promise<Card[]> {
  const rowToOpts = (row: string[]): ITextCardOpts => {
    return {
      id: row[0],
      text1: row[1],
      text2: row[2],
      text3: row[3],
      text4: row[4]
    };
  };
  const data = await retrieveSheet(auth, apSpreadSheetId, textCardRange);

  const rows = data.values;
  if (!rows?.length) {
    console.log('No data found.');
    throw new Error('No data found');
  }
  const result: Card[] = [];
  rows.forEach((row: string[], index: number): void => {
    if (row[0] && row[0].trim().length > 0) {
      console.log('row ', index + ": ", row);
      const card = new TextCard(rowToOpts(row));
      result.push(card);
    }
  });
  return result;
}

function writeCards(cards: Card[]): void {
  if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync(OUTPUT_DIR);
  }
  cards.forEach((card) => {
    const pngBase64 = card.toBase64Png();
    fs.writeFileSync(OUTPUT_DIR + `/${card.getId()}.png`, pngBase64, 'base64');
  });

}

async function generateCardsFromSheet(auth: OAuth2Client | string): Promise<void> {
  const cards = await generateTextCards(auth);
  writeCards(cards);
  console.log('generateCardsFromSheet success, output to ', OUTPUT_DIR);
}

function main(): void {
  const cred = fs.readFileSync('credentials.json', 'utf8');
  authorize(JSON.parse(cred), generateCardsFromSheet);
}

main();


