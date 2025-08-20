/* sys lib */
import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/core";
import { Response } from "@models/response";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class FileService {
  constructor(private http: HttpClient) {}

  getCssLibrary(): Observable<string> {
    return this.http.get<string>(
      "https://raw.githubusercontent.com/rusnakdima/All_In_One_Toolkit_Tauri/refs/heads/master/css_library.json"
    );
  }

  async chooseFile<R>(typeFile: Array<string>): Promise<Response<R>> {
    return await invoke<Response<R>>("chooseFile", { typeFile });
  }

  async getDataFromAnyFile<R>(filePath: string): Promise<Response<R>> {
    return await invoke<Response<R>>("getDataFileByPath", { filePath });
  }

  async getDataFromXLS<R>(filePath: string): Promise<Response<R>> {
    return await invoke<Response<R>>("getDataFileByPathXls", { filePath });
  }

  async writeDataToFile<R>(nameFile: string, content: string, extension: string): Promise<Response<R>> {
    return await invoke<Response<R>>("writeDataToFile", { nameFile, content, extension });
  }

  async writeDataToFileXls<R>(nameFile: string, content: Array<Array<any>>): Promise<Response<R>> {
    return await invoke<Response<R>>("writeDataToFileXls", { nameFile, content });
  }

  async openFolderWithFile<R>(pathFile: string): Promise<Response<R>> {
    return await invoke<Response<R>>("openFolderWithFile", { path: pathFile });
  }

  async openFileInApp<R>(pathFile: string): Promise<Response<R>> {
    return await invoke<Response<R>>("openFileInApp", { path: pathFile });
  }
}
