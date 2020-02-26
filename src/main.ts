import fs from "fs";
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client';
import { Card } from "./Card/Card";
import { authorize } from "./google.api";
import { CardFactory, CardType } from "./Card/CardFactory";

const OUTPUT_DIR = __dirname + '/output';


async function generateCards(auth: OAuth2Client | string): Promise<Card[]> {
  const factory = new CardFactory(auth, [CardType.BackCard, CardType.TextCard]);
  return factory.generateCards();
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
  const cards = await generateCards(auth);
  writeCards(cards);
  console.log('generateCardsFromSheet success, output to ', OUTPUT_DIR);
}

function main(): void {
  const cred = fs.readFileSync('credentials.json', 'utf8');
  authorize(JSON.parse(cred), generateCardsFromSheet);
}

main();


