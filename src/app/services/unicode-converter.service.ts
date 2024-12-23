/* sys lib */
import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

/* models */
import { Response } from '@models/response';

@Injectable({
  providedIn: 'root'
})
export class UnicodeConverterService {
  constructor() { }

  async getInfoSymbol(typeCoding: string, content: string): Promise<Response> {
    return await invoke<Response>("get_info_symbol", { typeCoding, content });
  }
}
