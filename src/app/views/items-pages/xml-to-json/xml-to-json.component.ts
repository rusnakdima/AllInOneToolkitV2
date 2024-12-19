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
  selector: "app-xml-to-json",
  standalone: true,
  imports: [CommonModule, FileInputComponent, WindowNotifyComponent],
  templateUrl: "./xml-to-json.component.html",
})
export class XmlToJsonComponent {
  constructor(private fileService: FileService) {}

  dataNotify: Subject<INotify> = new Subject();

  typeFile: string = "xml";
  fileName: string = "";
  dataXml: string = "";
  dataJson: { [key: string]: any } | null = null;
  pathNewFile: string = "";

  setDataFile(dataFile: any) {
    this.dataXml = dataFile;
  }

  setFileName(event: any) {
    this.fileName = event;
  }

  setData(event: any) {
    this.dataXml = event.target.value;
  }

  public parseData(xmlNodes: Array<any>) {
    let tempObj: { [key: string]: any } = {};
    xmlNodes.forEach((elem: any) => {
      if ([...elem.children].length > 0) {
        let rez = this.parseData([...elem.children]);
        if (tempObj[elem.nodeName] != undefined) {
          tempObj[elem.nodeName].length == undefined
            ? (tempObj[elem.nodeName] = [tempObj[elem.nodeName], rez])
            : tempObj[elem.nodeName].push(rez);
        } else tempObj[elem.nodeName] = rez;
      } else tempObj[elem.nodeName] = elem.textContent;
    });
    return tempObj;
  }

  convertData() {
    if (this.dataXml != "") {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(this.dataXml, "text/xml");
      this.dataJson = this.parseData(Array.from(xmlDoc.children[0].children));

      if (this.dataJson && Object.keys(this.dataJson).length > 0) {
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
    if (this.dataJson) {
      const nameNewFile =
        this.fileName != ""
          ? /^(.+)\..+$/.exec(this.fileName)![1]
          : "xml_to_json";
      await this.fileService
        .writeDataToFile(nameNewFile, JSON.stringify(this.dataJson), "json")
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
    } else if (this.dataJson == null) {
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
