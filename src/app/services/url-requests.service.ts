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

  async sendRequest<R>(infoRequest: Request): Promise<Response<R>> {
    return await invoke<Response<R>>("sendRequest", { infoRequest });
  }

  async saveData<R>(listCollections: Array<Collection>): Promise<Response<R>> {
    return await invoke<Response<R>>("saveData", { listCollections });
  }

  async getData<R>(): Promise<Response<R>> {
    return await invoke<Response<R>>("getData");
  }
}
