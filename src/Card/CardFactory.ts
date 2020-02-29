import { Card, ICardOpts } from "./Card";
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client';
import { TextCard, rowToTextCardOpts } from "./TextCard";
import { BackCard, rowToBackCardOpts } from "./BackCard";
import { retrieveSheet } from "../google.api";

export enum CardType {
  TextCard = 'TextCard',
  BackCard = 'BackCard'
}

interface ICardBlueprint {
  targetConstructor: new(opts: ICardOpts) => Card;
  rowToOps: (row: string[]) => ICardOpts;
  sheetRange: string;
}

interface ICardFactoryBlueprint {
  [id: string]: ICardBlueprint;
}

/**
 * Add new Card type here
 */
const CardFactoryBlueprint: ICardFactoryBlueprint = {
  [CardType.TextCard]: {
    targetConstructor: TextCard,
    rowToOps: rowToTextCardOpts,
    sheetRange: process.env.TEXT_CARD_RANGE ?? ''
  },
  [CardType.BackCard]: {
    targetConstructor: BackCard,
    rowToOps: rowToBackCardOpts,
    sheetRange: process.env.BACK_CARD_RANGE ?? ''
  }
};

export class CardFactory {
  private typesToGen: CardType[];
  private auth: OAuth2Client | string;
  private AP_SHEET_ID: string

  public constructor(auth: OAuth2Client | string, typesToGen: CardType[], AP_SHEET_ID: string) {
    this.typesToGen = typesToGen;
    this.auth = auth;
    this.AP_SHEET_ID = AP_SHEET_ID;
  }

  private async generateCardsOfType(type: CardType): Promise<Card[]> {
    const blueprint = CardFactoryBlueprint[type];
    const data = await retrieveSheet(this.auth, this.AP_SHEET_ID, blueprint.sheetRange);

    const rows = data.values;
    if (!rows?.length) {
      console.log('No data found.');
      throw new Error('No data found');
    }
    const result: Card[] = [];
    rows.forEach((row: string[], index: number): void => {
      if (row[0] && row[0].trim().length > 0) {
        console.log('row ', index + ": ", row);
        const card = new blueprint.targetConstructor(blueprint.rowToOps(row));
        result.push(card);
      }
    });
    return result;
  }

  public async generateCards(): Promise<Card[]> {
    const proms = this.typesToGen.map((type) => {
      return this.generateCardsOfType(type);
    });
    const result = await Promise.all(proms);
    const flatten = result.reduce((acc, curr) => acc.concat(curr), []);
    return flatten;
  }
}