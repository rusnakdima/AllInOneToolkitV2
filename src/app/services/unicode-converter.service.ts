/* sys lib */
import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/core";

/* models */
import { Response } from "@models/response";

@Injectable({
  providedIn: "root",
})
export class UnicodeConverterService {
  constructor() {}

  async getInfoSymbol<R>(typeCoding: string, content: string): Promise<Response<R>> {
    return await invoke<Response<R>>("getInfoSymbol", { typeCoding, content });
  }
}
