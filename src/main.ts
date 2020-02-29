import dotenv from 'dotenv';
dotenv.config();
import fs from "fs";
import { Canvas, createCanvas } from "canvas";
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client';
import { Card, DEFAULT_CARD_WIDTH, DEFAULT_CARD_HEIGHT } from "./Card/Card";
import { authorize } from "./google.api";
import { CardFactory, ICardFactoryOutput } from "./Card/CardFactory";
import {CardType} from "./types/types";

const OUTPUT_DIR = __dirname + '/output';

const CARD_SHEET_COLUMNS = 10;
const CARD_SHEET_ROWS = 7;
const MAX_CARD_COUNT = 70; // 70 is the max allowed by Tabletop Simulator

async function generateCards(auth: OAuth2Client | string): Promise<ICardFactoryOutput[]> {
  const factory = new CardFactory(auth, [CardType.BackCard, CardType.TextCard], process.env.AP_SHEET_ID ?? '');
  return factory.generateCards();
}

function writeCards(cards: Card[]): void {
  if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync(OUTPUT_DIR);
  }
  cards.forEach((card) => {
    const pngBase64 = card.toBase64Png();
    for(let i = 0; i < card.getQuantity(); i++) {
      fs.writeFileSync(OUTPUT_DIR + `/${card.getId()}-${i}.png`, pngBase64, 'base64');
    }
  });
}

function writeCardSheet(cardFactoryOutput: ICardFactoryOutput[]): void {
  const cardBacks = cardFactoryOutput.find(cardFactoryOutput => cardFactoryOutput.type === CardType.BackCard);
  if (!cardBacks) {
    throw new Error("[Error] Card backs could not be found");
  }
  if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync(OUTPUT_DIR);
  }

  const cardFronts = cardFactoryOutput.filter(cardFactoryOutput => cardFactoryOutput.type !== CardType.BackCard);
  const totalCards = cardFronts.reduce((acc, cardFront) => acc + cardFront.cards.reduce((cardQuantities, card) => cardQuantities + card.getQuantity(), 0), 0);
  const maxCardCountPerSheet = Math.min(CARD_SHEET_COLUMNS * CARD_SHEET_ROWS, MAX_CARD_COUNT);
  const outputSheetCount = Math.ceil(totalCards / maxCardCountPerSheet);

  let currentCardCount = 0;
  let currentCardInSheet = 0;
  let unprintedCardCount = totalCards;
  let frontCanvas: Canvas | null;
  let backCanvas: Canvas | null;
  let currentSheetIndex = 0;
  console.log(`[DeckSheet] ${totalCards} cards to generate, ${outputSheetCount}*2 sheets will be generated`);

  const outputSheet = () => {
    if (frontCanvas && backCanvas) {
      const frontPNGBase64 = frontCanvas.toDataURL().replace(/^data:image\/png;base64,/, "");
      const backPNGBase64 = backCanvas.toDataURL().replace(/^data:image\/png;base64,/, "");
      fs.writeFileSync(OUTPUT_DIR + `/front-${currentSheetIndex}.png`, frontPNGBase64, 'base64');
      fs.writeFileSync(OUTPUT_DIR + `/back-${currentSheetIndex}.png`, backPNGBase64, 'base64');
      currentSheetIndex++;
      unprintedCardCount -= currentCardInSheet;
      currentCardInSheet = 0;
      frontCanvas = null;
      backCanvas = null;
    }
  };

  const generateCanvas = () => {
    if (!frontCanvas || !backCanvas) {
      // Create a new canvas with a resolution based on how many cards are left
      const cardsInNextSheet = Math.min(maxCardCountPerSheet, unprintedCardCount);
      const columns = cardsInNextSheet >= CARD_SHEET_COLUMNS ? CARD_SHEET_COLUMNS : cardsInNextSheet;
      const rows = Math.ceil(cardsInNextSheet / CARD_SHEET_COLUMNS);
      const width = DEFAULT_CARD_WIDTH * columns;
      const height = DEFAULT_CARD_HEIGHT * rows;
      console.log(`[DeckSheet] Generating sheet ${currentSheetIndex}: ${width}x${height} | ${columns}x${rows} | ${cardsInNextSheet} cards`);
      frontCanvas = createCanvas(width, height);
      backCanvas = createCanvas(width, height);
      currentCardInSheet = 0;
    }
  };

  cardFronts.forEach((cardFront) => {
    const cards = cardFront.cards;
    cards.forEach(card => {
      for (let i=0; i<card.getQuantity(); i++) {
        generateCanvas();
        if (frontCanvas) card.draw(frontCanvas, (currentCardInSheet % CARD_SHEET_COLUMNS) * card.width, Math.floor(currentCardInSheet / CARD_SHEET_COLUMNS) * card.height);
        const backCard = cardBacks.cards.find((backCard) => backCard.getId().toLowerCase() === card.category.toLowerCase());
        if (backCard && backCanvas) {
          backCard.draw(backCanvas, (currentCardInSheet % CARD_SHEET_COLUMNS) * card.width, Math.floor(currentCardInSheet / CARD_SHEET_COLUMNS) * card.height);
        } else {
          console.warn(`[DeckSheet] Could not find back card for "${card.getId()}"`);
        }
        currentCardInSheet++;
        currentCardCount++;

        if (currentCardInSheet >= maxCardCountPerSheet) {
          outputSheet();
        }
      }
    });
  });
  if (unprintedCardCount > 0) {
    outputSheet();
  }
  console.log(`[DeckSheet] Done!`);
}

async function generateCardsFromSheet(auth: OAuth2Client | string): Promise<void> {
  const cardFactoryOutput = await generateCards(auth);
  // writeCards(cards);
  writeCardSheet(cardFactoryOutput);
  console.log('generateCardsFromSheet success, output to ', OUTPUT_DIR);
}

function main(): void {
  const cred = fs.readFileSync('credentials.json', 'utf8');
  authorize(JSON.parse(cred), generateCardsFromSheet);
}

main();


