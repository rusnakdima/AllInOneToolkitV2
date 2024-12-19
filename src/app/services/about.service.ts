/* sys lib */
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { invoke } from "@tauri-apps/api/core";

/* env */
import { environment } from "@env/environment";

/* models */
import { Response } from "@models/response";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class AboutService {
  constructor(private http: HttpClient) {}

  nameProduct: string = environment.nameProduct;

  getDate(version: string): Observable<any> {
    return this.http.get<any>(
      `https://api.github.com/repos/rusnakdima/${this.nameProduct}/releases/tags/v${version}`,
      httpOptions,
    );
  }

  async getBinaryNameFile(): Promise<Response> {
    return (await invoke("get_binary_name_file")) as Response;
  }

  checkUpdate(): Observable<any> {
    return this.http.get<any>(
      `https://api.github.com/repos/rusnakdima/${this.nameProduct}/releases/latest`,
      httpOptions,
    );
  }

  async downloadUpdate(version: string, nameFile: string): Promise<Response> {
    return (await invoke("download_update", {
      url: `https://github.com/rusnakdima/${this.nameProduct}/releases/download/${version}/${nameFile}`,
      fileName: nameFile,
    })) as Response;
  }

  async openFile(path: string): Promise<Response> {
    return (await invoke("open_file", { path: path })) as Response;
  }
}
