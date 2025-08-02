/* sys lib */
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/* models */
import { Response, ResponseStatus } from "@models/response";

/* services */
import { FileService } from "@services/file.service";
import { NotifyService } from "@services/notify.service";

/* components */
import { FileInputComponent } from "@components/fields/file-input/file-input.component";

@Component({
  selector: "app-json-to-xml",
  standalone: true,
  imports: [CommonModule, FileInputComponent],
  templateUrl: "./json-to-xml.component.html",
})
export class JsonToXmlComponent {
  constructor(
    private fileService: FileService,
    private notifyService: NotifyService
  ) {}

  typeFile: Array<string> = ["json"];
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
      this.notifyService.showError(err.toString());
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
        this.notifyService.showSuccess("The data has been successfully converted!");
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
        this.fileName != "" ? /^(.+)\..+$/.exec(this.fileName)![1] : "json_to_xml";
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
          this.notifyService.showError(`An error occurred while saving the data to a file: ${err}`);
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
