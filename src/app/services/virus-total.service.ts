/* sys lib */
import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

/* models */
import { Response } from '@models/response';

@Injectable({
  providedIn: 'root'
})
export class VirusTotalService {
  constructor() { }

  async checkOnViruses(url: string): Promise<Response> {
    const rawRes = (await invoke("virus_total", { url })) as string;
    return Response.fromJson(JSON.parse(rawRes), true);
  }
}
