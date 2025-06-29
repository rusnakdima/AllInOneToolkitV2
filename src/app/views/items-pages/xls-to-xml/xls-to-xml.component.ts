/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* models */
import { Response, ResponseStatus } from "@models/response";

/* services */
import { FileService } from "@services/file.service";
import { NotifyService } from "@services/notify.service";

/* components */
import { FileInputComponent } from "@shared/fields/file-input/file-input.component";

@Component({
  selector: "app-xls-to-xml",
  standalone: true,
  imports: [CommonModule, FileInputComponent],
  templateUrl: "./xls-to-xml.component.html",
})
export class XlsToXmlComponent {
  constructor(
    private fileService: FileService,
    private notifyService: NotifyService
  ) {}

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
      this.notifyService.showError("The field is empty! Insert the data!");
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
        this.notifyService.showSuccess(
          "The data has been successfully converted!"
        );
      } else {
        this.notifyService.showError("No data was received from the file!");
      }
    } else {
      this.notifyService.showError("There is no data for conversion!");
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
          if (data.status == ResponseStatus.SUCCESS) {
            this.pathNewFile = data.data;
            this.notifyService.showSuccess(
              `The data has been successfully saved to a file "${this.pathNewFile}"!`
            );
          } else {
            this.notifyService.showNotify(data.status, data.message);
          }
        })
        .catch((err) => {
          console.error(err);
          this.notifyService.showError(
            `An error occurred while saving the data to a file: ${err}`
          );
        });
    } else if (this.dataXml == "") {
      this.notifyService.showError("No data was received from the file!");
    }
  }

  async openFile() {
    if (this.pathNewFile != "") {
      await this.fileService
        .openFileInApp(this.pathNewFile)
        .then((data: Response) => {
          if (data.status == ResponseStatus.SUCCESS) {
            this.notifyService.showWarning(
              "Wait a bit until the program starts to read this file format!"
            );
          } else {
            this.notifyService.showNotify(data.status, data.message);
          }
        })
        .catch((err: any) => {
          console.error(err);
          this.notifyService.showError(err);
        });
    } else {
      this.notifyService.showError("You didn't save the file to open it!");
    }
  }
}
