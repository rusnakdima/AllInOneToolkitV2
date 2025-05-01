/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Subject } from "rxjs";

/* models */
import { Response } from "@models/response";

/* services */
import { FileService } from "@services/file.service";

/* components */
import { XmlToJsonComponent } from "../xml-to-json/xml-to-json.component";
import { JsonToXlsComponent } from "../json-to-xls/json-to-xls.component";
import { FileInputComponent } from "@views/shared/fields/file-input/file-input.component";
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-xml-to-xls",
  standalone: true,
  imports: [CommonModule, FileInputComponent, WindowNotifyComponent],
  templateUrl: "./xml-to-xls.component.html",
})
export class XmlToXlsComponent {
  constructor(private fileService: FileService) {}

  dataNotify: Subject<INotify> = new Subject();

  typeFile: Array<string> = ["xml"];
  fileName: string = "";
  dataXml: string = "";
  dataXls: Array<any> = [];
  pathNewFile: string = "";

  setDataFile(dataFile: any) {
    this.dataXml = dataFile;
  }

  setFileName(event: any) {
    this.fileName = event;
  }

  setData(event: any) {
    try {
      this.dataXml = event.target.value;
    } catch (err: any) {
      console.error(err);
      this.dataNotify.next({ status: "error", text: err.toString() });
    }
  }

  convertData() {
    if (this.dataXml != "") {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(this.dataXml, "text/xml");
      const dataJson = XmlToJsonComponent.prototype.parseData(
        Array.from(xmlDoc.children[0].children)
      );
      this.dataXls = JsonToXlsComponent.prototype.parseObj(dataJson);

      if (this.dataXls.length > 0) {
        this.dataNotify.next({
          status: "success",
          text: "The data has been successfully converted!",
        });
      } else {
        this.dataNotify.next({
          status: "error",
          text: "No data was received from the file!",
        });
      }
    } else {
      this.dataNotify.next({
        status: "error",
        text: "There is no data for conversion!",
      });
    }
  }

  async saveData() {
    if (this.dataXls.length > 0) {
      const nameNewFile =
        this.fileName != ""
          ? /^(.+)\..+$/.exec(this.fileName)![1]
          : "xml_to_xls";
      await this.fileService
        .writeDataToFileXls(nameNewFile, this.dataXls)
        .then((data: Response) => {
          if (data.status == "success") {
            this.pathNewFile = data.data;
            this.dataNotify.next({
              status: "success",
              text: `The data has been successfully saved to a file "${this.pathNewFile}"!`,
            });
          } else {
            this.dataNotify.next({
              status: data.status,
              text: data.message,
            });
          }
        })
        .catch((err) => {
          console.error(err);
          this.dataNotify.next({
            status: "error",
            text: `An error occurred while saving the data to a file: ${err}`,
          });
        });
    } else if (this.dataXls.length == 0) {
      this.dataNotify.next({
        status: "error",
        text: "No data was received from the file!",
      });
    }
  }

  async openFile() {
    if (this.pathNewFile != "") {
      await this.fileService
        .openFileInApp(this.pathNewFile)
        .then((data: Response) => {
          if (data.status == "success") {
            this.dataNotify.next({
              status: "warning",
              text: "Wait a bit until the program starts to read this file format!",
            });
          } else {
            this.dataNotify.next({
              status: data.status,
              text: data.message,
            });
          }
        })
        .catch((err: any) => {
          console.error(err);
          this.dataNotify.next({ status: "error", text: err });
        });
    } else {
      this.dataNotify.next({
        status: "error",
        text: "You didn't save the file to open it!",
      });
    }
  }
}
