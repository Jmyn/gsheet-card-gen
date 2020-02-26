import { Canvas } from "canvas";

const LINE_SPACING = 5;
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 600;

export interface ICardOpts {
  width?: number;
  height?: number;
  id: string;
}

export abstract class Card {
  protected width: number;
  protected height: number;
  private id: string;

  public constructor(opts?: ICardOpts) {
    this.width = opts?.width ?? DEFAULT_WIDTH;
    this.height = opts?.height ?? DEFAULT_HEIGHT;
    this.id = opts?.id ?? 'default_id';
  }

  public getId(): string {
    return this.id;
  }

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
      if (width < this.width) {
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
    return this.width * fx;
  }

  protected y(fy: number): number {
    return this.height * fy;
  }
}