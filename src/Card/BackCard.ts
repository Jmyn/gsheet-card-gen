import { Card, ICardOpts, DEFAULT_CARD_WIDTH, DEFAULT_CARD_HEIGHT } from "./Card";
import { Canvas, createCanvas } from "canvas";
import {CardType} from "../types/types";

export interface IBackCardOpts extends ICardOpts {
  text1: string;
  backColor: string;
  textColor: string;
}

const DEFAULT_OPTS: IBackCardOpts = {
  width: DEFAULT_CARD_WIDTH,
  height: DEFAULT_CARD_HEIGHT,
  id: 'default',
  text1: '',
  backColor: 'black',
  textColor: 'white',
  quantity: 1,
  type: CardType.BackCard,
};

export const rowToBackCardOpts = (type: CardType, row: string[]): IBackCardOpts => {
  return {
    id: row[0],
    text1: row[2],
    backColor: row[3],
    textColor: row[4],
    quantity: parseInt(row[1]),
    type: type,
  };
};

export class BackCard extends Card {
  private opts: IBackCardOpts;

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
    ctx.fillStyle = this.opts.backColor;
    ctx.fillRect(xOffset, yOffset, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 10;
    ctx.strokeRect(xOffset, yOffset, canvas.width, canvas.height);

    ctx.fillStyle = this.opts.textColor;
    ctx.font = '50px Impact';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    this.fillText(ctx, this.opts.text1 ?? '', xOffset + this.x(0.5), yOffset + this.y(0.5));
  }
}