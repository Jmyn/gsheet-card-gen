import {Card, ICardOpts} from "./Card";
import {OAuth2Client} from 'google-auth-library/build/src/auth/oauth2client';
import {rowToTextCardOpts, TextCard} from "./TextCard";
import {BackCard, rowToBackCardOpts} from "./BackCard";
import {retrieveSheet} from "../google.api";
import {CardType} from "../types/types";

interface ICardBlueprint {
  targetConstructor: new(opts: ICardOpts) => Card;
  rowToOps: (type: CardType, row: string[]) => ICardOpts;
  sheetRange: string;
}

interface ICardFactoryBlueprint {
  [id: string]: ICardBlueprint;
}

export interface ICardFactoryOutput {
  type: CardType;
  cards: Card[];
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

  private async generateCardsOfType(type: CardType): Promise<ICardFactoryOutput> {
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
        const card = new blueprint.targetConstructor(blueprint.rowToOps(type, row));
        result.push(card);
      }
    });
    return {type, cards: result};
  }

  public async generateCards(): Promise<ICardFactoryOutput[]> {
    const proms = this.typesToGen.map((type) => {
      return this.generateCardsOfType(type);
    });
    const result = await Promise.all(proms);
    // const flatten = result.reduce((acc, curr) => acc.concat(curr), []);
    return result;
  }
}