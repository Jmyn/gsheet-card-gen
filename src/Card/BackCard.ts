import { Card, ICardOpts } from "./Card";
import { Canvas, createCanvas } from "canvas";

export interface IBackCardOpts extends ICardOpts {
  text1: string;
  backColor: string;
  textColor: string;
}

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 600;
const DEFAULT_OPTS: IBackCardOpts = {
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  id: 'default',
  text1: '',
  backColor: 'black',
  textColor: 'white',
  quantity: 1
};

export const rowToBackCardOpts = (row: string[]): IBackCardOpts => {
  return {
    id: row[0],
    text1: row[2],
    backColor: row[3],
    textColor: row[4],
    quantity: parseInt(row[1])
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
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = this.opts.backColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = this.opts.textColor;
    ctx.font = '50px Impact';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    this.fillText(ctx, this.opts.text1 ?? '', this.x(0.5), this.y(0.5));

    return canvas;
  }
}