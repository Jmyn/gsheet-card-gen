import { Card } from "./Card";
import { Canvas, createCanvas, CanvasRenderingContext2D } from "canvas";

export interface ITextCardOpts {
  width?: number;
  height?: number;
  id: string;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
}
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 600;
const DEFAULT_OPTS: ITextCardOpts = {
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  id: 'default',
  text1: '',
  text2: '',
  text3: '',
  text4: '',
};

export class TextCard extends Card {
  private opts: ITextCardOpts;

  public constructor(opts?: ITextCardOpts) {
    super(opts?.width ?? DEFAULT_WIDTH, opts?.height ?? DEFAULT_HEIGHT, opts?.id ?? DEFAULT_OPTS.id);
    this.opts = Object.assign({}, DEFAULT_OPTS ,opts);
  }

  private create(): Canvas {
    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = '30px Impact';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    this.fillText(ctx, this.opts.text1 ?? '', this.x(0.5), this.y(0.125 * 1));
    this.fillText(ctx, this.opts.text2 ?? '', this.x(0.5), this.y(0.125 * 3));
    this.fillText(ctx, this.opts.text3 ?? '', this.x(0.5), this.y(0.125 * 5));
    this.fillText(ctx, this.opts.text4 ?? '', this.x(0.5), this.y(0.125 * 7));

    return canvas;
  }


  public toBase64Png(): string {
    const canvas = this.create();
    return canvas.toDataURL().replace(/^data:image\/png;base64,/, "");
  }
}