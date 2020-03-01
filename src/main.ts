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

  const cardFronts = cardFactoryOutput.filter(cardFactoryOutput => cardFactoryOutput.type !== CardType.BackCard).reduce((acc: Card[], cardFront) => {
    acc.push(...cardFront.cards);
    return acc;
  }, []);
  const totalCards = cardFronts.reduce((cardQuantities, card) => cardQuantities + card.getQuantity(), 0); // cardFronts.reduce((acc, cardFront) => acc + , 0);
  const maxCardCountPerSheet = Math.min(CARD_SHEET_COLUMNS * CARD_SHEET_ROWS, MAX_CARD_COUNT);
  // const outputSheetCount = Math.ceil(totalCards / maxCardCountPerSheet);

  let currentCardInSheet = 0;
  let unprintedCardInCategoryCount = 0;
  let currentCategorySheetIndex = 0;
  let currentSheetCategory = '';
  let frontCanvas: Canvas | null;
  let backCanvas: Canvas | null;
  console.log(`[DeckSheet] ${totalCards} cards to generate`);

  const outputSheet = (): void => {
    if (frontCanvas && backCanvas) {
      const frontPNGBase64 = frontCanvas.toDataURL().replace(/^data:image\/png;base64,/, "");
      const backPNGBase64 = backCanvas.toDataURL().replace(/^data:image\/png;base64,/, "");
      fs.writeFileSync(OUTPUT_DIR + `/${currentSheetCategory}-front-${currentCategorySheetIndex}-${currentCardInSheet}.png`, frontPNGBase64, 'base64');
      fs.writeFileSync(OUTPUT_DIR + `/${currentSheetCategory}-back-${currentCategorySheetIndex}-${currentCardInSheet}.png`, backPNGBase64, 'base64');
      currentCategorySheetIndex++;
      unprintedCardInCategoryCount -= currentCardInSheet;
      currentCardInSheet = 0;
      frontCanvas = null;
      backCanvas = null;
    }
  };

  const generateCanvas = (): void => {
    if (!frontCanvas || !backCanvas) {
      // Create a new canvas with a resolution based on how many cards are left
      const cardsInNextSheet = Math.min(maxCardCountPerSheet, unprintedCardInCategoryCount);
      const columns = cardsInNextSheet >= CARD_SHEET_COLUMNS ? CARD_SHEET_COLUMNS : cardsInNextSheet;
      const rows = Math.ceil(cardsInNextSheet / CARD_SHEET_COLUMNS);
      const width = DEFAULT_CARD_WIDTH * columns;
      const height = DEFAULT_CARD_HEIGHT * rows;
      console.log(`[DeckSheet] Generating sheet for ${currentSheetCategory} (${currentCategorySheetIndex}): ${width}x${height} | ${columns}x${rows} | ${cardsInNextSheet} cards`);
      frontCanvas = createCanvas(width, height);
      backCanvas = createCanvas(width, height);
      currentCardInSheet = 0;
    }
  };

  // Generate sheets organised by card category (identified using card backs)
  cardBacks.cards.forEach((cardBack) => {
    const cardsInCategory = cardFronts.filter((cardFront)=>cardFront.category.toLowerCase() === cardBack.getId().toLowerCase());
    const cardsInCategoryCount = cardsInCategory.reduce((cardQuantities, card) => cardQuantities + card.getQuantity(), 0);
    currentSheetCategory = cardBack.category.toLowerCase();
    currentCategorySheetIndex = 0;
    unprintedCardInCategoryCount = cardsInCategoryCount;
    cardsInCategory.forEach(card => {
      for (let i=0; i<card.getQuantity(); i++) {
        generateCanvas();
        if (frontCanvas) card.draw(frontCanvas, (currentCardInSheet % CARD_SHEET_COLUMNS) * card.width, Math.floor(currentCardInSheet / CARD_SHEET_COLUMNS) * card.height);
        if (backCanvas) cardBack.draw(backCanvas, (currentCardInSheet % CARD_SHEET_COLUMNS) * card.width, Math.floor(currentCardInSheet / CARD_SHEET_COLUMNS) * card.height);
        currentCardInSheet++;

        if (currentCardInSheet >= maxCardCountPerSheet) {
          outputSheet();
        }
      }
    });
    if (unprintedCardInCategoryCount > 0) {
      outputSheet();
    }
  });
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


