import { Card, ICardOpts } from "./Card";
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client';
import { TextCard, rowToTextCardOpts, textCardSheetRange } from "./TextCard";
import { BackCard, rowToBackCardOpts, backCardSheetRange } from "./BackCard";
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

const CardFactoryBlueprint: ICardFactoryBlueprint = {
  [CardType.TextCard]: {
    targetConstructor: TextCard,
    rowToOps: rowToTextCardOpts,
    sheetRange: textCardSheetRange
  },
  [CardType.BackCard]: {
    targetConstructor: BackCard,
    rowToOps: rowToBackCardOpts,
    sheetRange: backCardSheetRange
  }
};

const AP_SHEET_ID = '1LHz2cNZJOJqT9gIic-RBy1TX4iLk8rRHZbk73Nrz1J4';

export class CardFactory {
  private typesToGen: CardType[];
  private auth: OAuth2Client | string;

  public constructor(auth: OAuth2Client | string, typesToGen: CardType[]) {
    this.typesToGen = typesToGen;
    this.auth = auth;
  }

  private async generateCardsOfType(type: CardType): Promise<Card[]> {
    const blueprint = CardFactoryBlueprint[type];
    const data = await retrieveSheet(this.auth, AP_SHEET_ID, blueprint.sheetRange);

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