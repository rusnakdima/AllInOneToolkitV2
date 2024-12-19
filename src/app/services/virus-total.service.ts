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
    return (await invoke("virus_total", { url })) as Response;
  }
}
