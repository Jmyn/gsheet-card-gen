import { Card, ICardOpts, DEFAULT_CARD_WIDTH, DEFAULT_CARD_HEIGHT } from "./Card";
import { Canvas, createCanvas } from "canvas";
import {CardType} from "../types/types";

export interface ITextCardOpts extends ICardOpts {
  text1: string;
  text2: string;
  text3: string;
  text4: string;
}

const DEFAULT_OPTS: ITextCardOpts = {
  width: DEFAULT_CARD_WIDTH,
  height: DEFAULT_CARD_HEIGHT,
  id: 'default',
  text1: '',
  text2: '',
  text3: '',
  text4: '',
  quantity: 1,
  type: CardType.TextCard,
};


export const rowToTextCardOpts = (type: CardType, row: string[]): ITextCardOpts => {
  return {
    id: row[0],
    text1: row[2],
    text2: row[3],
    text3: row[4],
    text4: row[5],
    quantity: parseInt(row[1]),
    type: type,
  };
};

export class TextCard extends Card {
  private opts: ITextCardOpts;

  public constructor(opts: ICardOpts) {
    super(opts);
    this.opts = Object.assign({}, DEFAULT_OPTS ,opts);
  }

  protected create(): Canvas {
    const canvas = createCanvas(this.width, this.height);
    this.draw(canvas, 0, 0);
    return canvas;
  }

  public draw(canvas: Canvas, xOffset = 0, yOffset = 0): void {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(xOffset, yOffset, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 10;
    ctx.strokeRect(xOffset, yOffset, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = '30px Impact';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    this.fillText(ctx, this.opts.text1 ?? '', xOffset + this.x(0.5), yOffset + this.y(0.125 * 1));
    this.fillText(ctx, this.opts.text2 ?? '', xOffset + this.x(0.5), yOffset + this.y(0.125 * 3));
    this.fillText(ctx, this.opts.text3 ?? '', xOffset + this.x(0.5), yOffset + this.y(0.125 * 5));
    this.fillText(ctx, this.opts.text4 ?? '', xOffset + this.x(0.5), yOffset + this.y(0.125 * 7));
  }
}