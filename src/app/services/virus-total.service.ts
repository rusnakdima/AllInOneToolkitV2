/* sys lib */
import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/core";

/* models */
import { Response } from "@models/response";

@Injectable({
  providedIn: "root",
})
export class VirusTotalService {
  constructor() {}

  async checkOnViruses<R>(url: string): Promise<Response<R>> {
    return await invoke<Response<R>>("virusTotal", { url });
  }
}
