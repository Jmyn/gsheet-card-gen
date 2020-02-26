
export abstract class Card {
  protected width: number;
  protected height: number;
  private id: string;

  public constructor(width: number, height: number, id: string) {
    this.width = width;
    this.height = height;
    this.id = id;
  }

  public getId(): string {
    return this.id;
  }

  public abstract toBase64Png(): string;

  protected fillText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number): void {
    const words: string[] = text.split(" ");
    const lines: string[] = [];
    let curr: string | undefined = undefined;
    let offset: number | undefined = undefined;

    if(words.length === 0) {
      return;
    }

    words.forEach((word: string): void => {
      if(!curr) {
        curr = word;
        return;
      }
      const metric = ctx.measureText(curr + " " + word);
      offset = offset ?? 5 + metric.actualBoundingBoxAscent * 2;
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
      const nexty = y + index * (offset ?? 5);
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