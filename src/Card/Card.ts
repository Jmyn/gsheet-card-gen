import { Canvas } from "canvas";
import {CardType} from "../types/types";

const LINE_SPACING = 5;
export const DEFAULT_CARD_WIDTH = 400;
export const DEFAULT_CARD_HEIGHT = 600;

export interface ICardOpts {
  width?: number;
  height?: number;
  id: string;
  quantity: number;
  type: CardType;
}

export abstract class Card {
  public get category(): string {
    return this._category;
  }
  public get height(): number {
    return this._height;
  }
  public get width(): number {
    return this._width;
  }
  protected _width: number;
  protected _height: number;
  protected quantity: number;
  protected _category: string;
  protected type: CardType;
  private id: string;

  public constructor(opts?: ICardOpts) {
    this._width = opts?.width ?? DEFAULT_CARD_WIDTH;
    this._height = opts?.height ?? DEFAULT_CARD_HEIGHT;
    this.id = opts?.id ?? 'default_id';
    this.quantity = opts?.quantity ?? 1;
    this._category = this.id.split('_')[0];
    this.type = opts?.type ?? CardType.TextCard;
  }

  public getId(): string {
    return this.id;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public abstract draw(canvas: Canvas, xOffset: number, yOffset: number): void;

  protected abstract create(): Canvas;

  public toBase64Png(): string {
    const canvas = this.create();
    return canvas.toDataURL().replace(/^data:image\/png;base64,/, "");
  }

  protected fillText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): void {
    const words: string[] = text.split(" ");
    const lines: string[] = [];
    let curr: string | undefined = undefined;
    let offset: number | undefined = undefined;

    if(words.length === 0) {
      return;
    }

    //word wrap
    words.forEach((word: string): void => {
      if(!curr) {
        curr = word;
        return;
      }
      const metric = ctx.measureText(curr + " " + word);
      offset = offset ?? LINE_SPACING + metric.actualBoundingBoxAscent * 2;
      // console.log(`metric for ${curr + " " + word}: ${JSON.stringify(metric)}`);
      const width = metric.width;
      if (width < this._width) {
        curr += " " + word;
      } else {
        lines.push(curr);
        curr = word;
      }
    });
    if(curr) {
      lines.push(curr);
    }

    lines.forEach((line: string, index: number): void => {
      const nexty = y + index * (offset ?? LINE_SPACING);
      ctx.fillText(line, x, nexty);
    });
  }

  protected x(fx: number): number {
    return this._width * fx;
  }

  protected y(fy: number): number {
    return this._height * fy;
  }
}