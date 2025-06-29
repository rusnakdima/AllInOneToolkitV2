/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* models */
import { Response, ResponseStatus } from "@models/response";

/* services */
import { FileService } from "@services/file.service";
import { NotifyService } from "@services/notify.service";

/* components */
import { XmlToJsonComponent } from "../xml-to-json/xml-to-json.component";
import { JsonToXlsComponent } from "../json-to-xls/json-to-xls.component";
import { FileInputComponent } from "@shared/fields/file-input/file-input.component";

@Component({
  selector: "app-xml-to-xls",
  standalone: true,
  imports: [CommonModule, FileInputComponent],
  templateUrl: "./xml-to-xls.component.html",
})
export class XmlToXlsComponent {
  constructor(
    private fileService: FileService,
    private notifyService: NotifyService
  ) {}

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
      this.notifyService.showError(err.toString());
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
    if (this.dataXls.length > 0) {
      const nameNewFile =
        this.fileName != ""
          ? /^(.+)\..+$/.exec(this.fileName)![1]
          : "xml_to_xls";
      await this.fileService
        .writeDataToFileXls(nameNewFile, this.dataXls)
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
    } else if (this.dataXls.length == 0) {
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
