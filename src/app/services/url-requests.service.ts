/* sys lib */
import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/core";

/* models */
import { Response } from "@models/response";
import { Request } from "@models/request";
import { Collection } from "@models/collection";

@Injectable({
  providedIn: "root",
})
export class UrlRequestsService {
  constructor() {}

  async sendRequest(infoRequest: Request): Promise<Response> {
    return await invoke<Response>("send_request", { infoRequest });
  }

  async saveData(listCollections: Array<Collection>): Promise<Response> {
    return await invoke<Response>("save_data", { listCollections });
  }

  async getData(): Promise<Response> {
    return await invoke<Response>("get_data");
  }
}
