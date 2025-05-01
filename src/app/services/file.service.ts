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
    return this.http.get<string>("https://raw.githubusercontent.com/rusnakdima/All_In_One_Toolkit_Tauri/refs/heads/master/css_library.json");
  }

  async chooseFile(typeFile: Array<string>): Promise<any> {
    return await invoke<Response>("choose_file", { typeFile });
  }

  async getDataFromAnyFile(filePath: string): Promise<Response> {
    return await invoke<Response>("get_data_file_by_path", { filePath });
  }

  async getDataFromXLS(filePath: string): Promise<Response> {
    return await invoke<Response>("get_data_file_by_path_xls", { filePath });
  }

  async writeDataToFile(nameFile: string, content: string, extension: string): Promise<any> {
    return await invoke<Response>("write_data_to_file", { nameFile, content, extension });
  }

  async writeDataToFileXls(nameFile: string, content: Array<Array<any>>): Promise<any> {
    return await invoke<Response>("write_data_to_file_xls", { nameFile, content });
  }

  async openFileInApp(pathFile: string): Promise<any> {
    return await invoke<Response>("open_file_in_app", { path: pathFile });
  }
}
