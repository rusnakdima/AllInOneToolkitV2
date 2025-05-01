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
  selector: "app-xls-to-xml",
  standalone: true,
  imports: [CommonModule, FileInputComponent, WindowNotifyComponent],
  templateUrl: "./xls-to-xml.component.html",
})
export class XlsToXmlComponent {
  constructor(private fileService: FileService) {}

  dataNotify: Subject<INotify> = new Subject();

  typeFile: Array<string> = ["xls"];
  fileName: string = "";
  dataXls: Array<any> = [];
  dataXml: string = "";
  pathNewFile: string = "";

  setDataFile(dataFile: any) {
    this.dataXls = JSON.parse(dataFile);
  }

  setFileName(event: any) {
    this.fileName = event;
  }

  setData(event: any) {
    if (event.target.value != "") {
      this.dataXls = event.target.value
        .split("\n")
        .map((elem: string) => elem.split("\t"));
    } else {
      this.dataNotify.next({
        status: "error",
        text: "The field is empty! Insert the data!",
      });
    }
  }

  parseData(dataArr: Array<any>) {
    let tempXml = "";
    let strokeF = dataArr[0];
    dataArr.splice(0, 1);
    dataArr.forEach((row: any) => {
      tempXml += `<array>`;
      row.forEach((cell: any, index: number) => {
        const key: string = strokeF[index]
          ? strokeF[index].replace(/[\" \"]/gi, "")
          : `column${index}`;
        tempXml += `<${key}>${cell}</${key}>`;
      });
      tempXml += `</array>`;
    });
    return tempXml;
  }

  convertData() {
    if (this.dataXls.length > 0) {
      this.dataXml = `<root>${this.parseData(this.dataXls)}</root>`;

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
          : "xls_to_xml";
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
