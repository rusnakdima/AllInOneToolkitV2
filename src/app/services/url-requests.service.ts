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
    return (await invoke("send_request", { infoRequest })) as Response;
  }

  async saveData(listCollections: Array<Collection>): Promise<Response> {
    return (await invoke("save_data", { listCollections })) as Response;
  }

  async getData(): Promise<Response> {
    return (await invoke("get_data")) as Response;
  }
}
