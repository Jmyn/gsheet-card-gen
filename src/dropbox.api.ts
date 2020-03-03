import fs from "fs";
import path from "path";
import {Dropbox} from "dropbox";
import fetch from "isomorphic-fetch";

export class DropboxUploader {
  private dropbox: Dropbox;

  constructor(accessToken: string) {
    this.dropbox = new Dropbox({accessToken, fetch});
  }

  public async getLink(path: string): Promise<string> {
    const existingLink = await this.dropbox.sharingListSharedLinks({path});
    if (existingLink.links.length > 0) {
      return existingLink.links[0].url;
    }
    const result = await this.dropbox.sharingCreateSharedLinkWithSettings({path});
    return result.url;
  }

  public async uploadFile(folder: string, filename: string): Promise<DropboxTypes.files.FileMetadata | undefined> {
    const file = Buffer.from(fs.readFileSync(filename));
    let response: DropboxTypes.files.FileMetadata | undefined = undefined;
    const uploadFilename = path.basename(filename);
    try {
      response = await this.dropbox.filesUpload({
        path: `/${folder}/${uploadFilename}`,
        contents: file,
        mode: {".tag": "overwrite"}
      });
    } catch (exception) {
      console.log('Exception in uploading file to Dropbox', exception);
    }
    return response;
  }
}
