/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Subject } from "rxjs";

/* models */
import { Response } from "@models/response";

/* services */
import { FileService } from "@services/file.service";

/* components */
import { FileInputComponent } from "@views/shared/fields/file-input/file-input.component";
import {
  INotify,
  WindowNotifyComponent,
} from "@views/shared/window-notify/window-notify.component";

@Component({
  selector: "app-json-to-xml",
  standalone: true,
  imports: [CommonModule, FileInputComponent, WindowNotifyComponent],
  templateUrl: "./json-to-xml.component.html",
})
export class JsonToXmlComponent {
  constructor(private fileService: FileService) {}

  dataNotify: Subject<INotify> = new Subject();

  typeFile: string = "json";
  fileName: string = "";
  dataJson: { [key: string]: any } = {};
  dataXml: string = "";
  pathNewFile: string = "";

  setDataFile(dataFile: any) {
    this.dataJson = JSON.parse(dataFile);
  }

  setFileName(event: any) {
    this.fileName = event;
  }

  setData(event: any) {
    try {
      this.dataJson = JSON.parse(event.target.value);
    } catch (err: any) {
      console.error(err);
      this.dataNotify.next({ status: "error", text: err.toString() });
    }
  }

  parseData(obj: { [key: string]: any }, stroke: string = "") {
    let tempElement = "";
    Object.entries(obj).forEach(([key, value]) => {
      if (value == null) {
        key = key.replace(/[\" \"]/gi, "");
        tempElement += `<${key}>null</${key}>`;
      } else if (Array.isArray(value)) {
        tempElement += `${this.parseData(value, key)}`;
      } else if (typeof value == "object") {
        key = isNaN(+key) ? key : stroke;
        key = key.replace(/[\" \"]/gi, "");
        tempElement += `<${key}>${this.parseData(value, key)}</${key}>`;
      } else {
        key = key.replace(/[\" \"]/gi, "");
        tempElement += `<${key}>${value}</${key}>`;
      }
    });
    return tempElement;
  }

  convertData() {
    if (Object.keys(this.dataJson).length > 0) {
      this.dataXml = `<xml>${this.parseData(this.dataJson)}</xml>`;
      if (this.dataXml != "") {
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
    if (this.dataXml != "") {
      const nameNewFile =
        this.fileName != ""
          ? /^(.+)\..+$/.exec(this.fileName)![1]
          : "json_to_xml";
      await this.fileService
        .writeDataToFile(nameNewFile, this.dataXml, "xml")
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
    } else if (this.dataXml == "") {
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
